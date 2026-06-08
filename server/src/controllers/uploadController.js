import fs from "fs/promises";
import path from "path";
import { PassThrough } from "stream";
import { fileURLToPath } from "url";

import { cloudinary, cloudinaryConfigured } from "../config/cloudinary.js";
import {
  deleteMediaGridFsFile,
  extractGridFsIdFromMediaUrl,
  getMediaGridFsFileInfo,
  openMediaGridFsDownloadStream,
  saveMediaBufferToGridFs,
} from "../utils/mediaGridFs.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..", "..");
const primaryUploadsRoot = path.join(serverRoot, "uploads");
const legacyUploadsRoot = path.join(serverRoot, "server", "uploads");

const documentMimeTypes = [
  "application/pdf",
  "application/x-pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/rtf",
  "text/plain",
  "application/vnd.oasis.opendocument.text",
];

const documentExtensions = [".pdf", ".doc", ".docx", ".rtf", ".txt", ".odt"];

const inferMimeTypeFromName = (name = "") => {
  const lower = String(name).toLowerCase();

  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".rtf")) return "application/rtf";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".odt")) return "application/vnd.oasis.opendocument.text";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".mp4")) return "video/mp4";

  return "application/octet-stream";
};

const uploadBufferToCloudinary = async (
  fileBuffer,
  mimeType,
  folder,
  resourceType = "auto",
  originalName = "",
) => {
  if (!cloudinaryConfigured) {
    const error = new Error("Cloudinary is not configured");
    error.statusCode = 500;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: Boolean(originalName),
        unique_filename: true,
        filename_override: originalName || undefined,
      },
      (error, uploaded) => {
        if (error) {
          reject(error);
          return;
        }

        if (!uploaded?.secure_url) {
          reject(new Error("Cloudinary upload did not return a URL"));
          return;
        }

        resolve(uploaded.secure_url);
      },
    );

    const input = new PassThrough();
    input.end(fileBuffer);
    input.pipe(uploadStream);
  });
};

const toAbsoluteUrl = (req, relativePath) =>
  `${req.protocol}://${req.get("host")}${relativePath}`;

const mediaStorageDriver = (process.env.MEDIA_STORAGE_DRIVER || "mongodb").toLowerCase();
const uploadStorageDriver = (process.env.UPLOAD_STORAGE_DRIVER || "mongodb").toLowerCase();

const uploadMediaAssetByType = async ({ req, file, type }) => {
  const configByType = {
    image: {
      folder: "trusonhub/media/images",
      allowed: ["image/jpeg", "image/png", "image/webp"],
      resourceType: "image",
    },
    video: {
      folder: "trusonhub/media/videos",
      allowed: ["video/mp4", "video/webm", "video/quicktime"],
      resourceType: "video",
    },
    document: {
      folder: "trusonhub/media/documents",
      allowed: documentMimeTypes,
      resourceType: "raw",
    },
  };

  const target = configByType[type];
  if (!target) {
    const error = new Error("Unsupported media upload type");
    error.statusCode = 400;
    throw error;
  }

  const validDocumentFallback =
    type === "document" &&
    documentExtensions.some((extension) =>
      String(file.originalname || "").toLowerCase().endsWith(extension),
    ) &&
    ["application/octet-stream", "binary/octet-stream"].includes(file.mimetype);

  if (!target.allowed.includes(file.mimetype) && !validDocumentFallback) {
    const error = new Error(`Invalid ${type} file format`);
    error.statusCode = 400;
    throw error;
  }

  const shouldUseCloudinary =
    type !== "document" && mediaStorageDriver === "cloudinary" && cloudinaryConfigured;

  if (shouldUseCloudinary) {
    return uploadBufferToCloudinary(
      file.buffer,
      file.mimetype,
      target.folder,
      target.resourceType,
      file.originalname || `${type}-${Date.now()}`,
    );
  }

  const gridFsId = await saveMediaBufferToGridFs({
    buffer: file.buffer,
    fileName: file.originalname || `${type}-${Date.now()}`,
    mimeType: file.mimetype,
    assetType: type,
  });

  return toAbsoluteUrl(req, `/api/uploads/media/file/${gridFsId}`);
};

const extractCloudinaryPublicIdCandidates = (assetUrl) => {
  if (typeof assetUrl !== "string" || !assetUrl.trim()) {
    return [];
  }

  try {
    const parsed = new URL(assetUrl);
    if (!parsed.hostname.includes("cloudinary.com")) {
      return [];
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1) {
      return [];
    }

    const afterUpload = [...segments.slice(uploadIndex + 1)];
    if (!afterUpload.length) {
      return [];
    }

    if (/^v\d+$/i.test(afterUpload[0])) {
      afterUpload.shift();
    }

    if (!afterUpload.length) {
      return [];
    }

    const joined = afterUpload.join("/");
    const withoutExtension = joined.replace(/\.[^./]+$/, "");
    return Array.from(new Set([joined, withoutExtension]));
  } catch {
    return [];
  }
};

const deleteCloudinaryAsset = async (url, assetType) => {
  if (!cloudinaryConfigured) {
    return false;
  }

  const publicIds = extractCloudinaryPublicIdCandidates(url);
  if (!publicIds.length) {
    return false;
  }

  const mappedResourceType =
    assetType === "video"
      ? ["video"]
      : assetType === "document"
        ? ["raw", "image"]
        : assetType === "image"
          ? ["image"]
          : ["image", "video", "raw"];

  for (const resourceType of mappedResourceType) {
    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });

      if (result?.result === "ok") {
        return true;
      }
    }
  }

  return false;
};

const getPathnameFromUrl = (url) => {
  if (typeof url !== "string" || !url.trim()) {
    return "";
  }

  if (url.startsWith("/")) {
    return url;
  }

  try {
    return new URL(url).pathname || "";
  } catch {
    return "";
  }
};

const removeLocalFileIfExists = async (absolutePath) => {
  try {
    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

const deleteLocalAssetByUrl = async (url) => {
  const pathname = getPathnameFromUrl(url);
  if (!pathname.startsWith("/uploads/")) {
    return false;
  }

  const relativePath = path.normalize(pathname.replace(/^\/uploads\//, ""));
  if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return false;
  }

  const candidateRoots = [primaryUploadsRoot, legacyUploadsRoot];

  for (const root of candidateRoots) {
    const base = path.resolve(root);
    const absolutePath = path.resolve(root, relativePath);

    if (!absolutePath.startsWith(`${base}${path.sep}`)) {
      continue;
    }

    const deleted = await removeLocalFileIfExists(absolutePath);
    if (deleted) {
      return true;
    }
  }

  return false;
};

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  let avatarUrl;
  if (uploadStorageDriver === "cloudinary" && cloudinaryConfigured) {
    avatarUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "trusonhub/avatar",
      "image",
      req.file.originalname || `avatar-${Date.now()}`,
    );
  } else {
    const gridFsId = await saveMediaBufferToGridFs({
      buffer: req.file.buffer,
      fileName: req.file.originalname || `avatar-${Date.now()}`,
      mimeType: req.file.mimetype,
      assetType: "avatar",
    });
    avatarUrl = toAbsoluteUrl(req, `/api/uploads/media/file/${gridFsId}`);
  }

  req.user.avatarUrl = avatarUrl;
  await req.user.save();

  res.status(201).json({ url: avatarUrl });
});

export const uploadProjectMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  let mediaUrl;
  if (uploadStorageDriver === "cloudinary" && cloudinaryConfigured) {
    mediaUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "trusonhub/projects",
      "auto",
      req.file.originalname || `project-${Date.now()}`,
    );
  } else {
    const gridFsId = await saveMediaBufferToGridFs({
      buffer: req.file.buffer,
      fileName: req.file.originalname || `project-${Date.now()}`,
      mimeType: req.file.mimetype,
      assetType: "project",
    });
    mediaUrl = toAbsoluteUrl(req, `/api/uploads/media/file/${gridFsId}`);
  }

  res.status(201).json({ url: mediaUrl });
});

export const uploadMediaImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const url = await uploadMediaAssetByType({
    req,
    file: req.file,
    type: "image",
  });

  res.status(201).json({ url });
});

export const uploadMediaVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const url = await uploadMediaAssetByType({
    req,
    file: req.file,
    type: "video",
  });

  res.status(201).json({ url });
});

export const uploadMediaDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const url = await uploadMediaAssetByType({
    req,
    file: req.file,
    type: "document",
  });

  res.status(201).json({ url });
});

export const getMediaAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const fileInfo = await getMediaGridFsFileInfo(id);

  if (!fileInfo) {
    res.status(404);
    throw new Error("Media file not found");
  }

  const mimeType =
    fileInfo.contentType || fileInfo.metadata?.mimeType || inferMimeTypeFromName(fileInfo.filename);
  const fileSize = fileInfo.length;

  res.setHeader("Content-Type", mimeType);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Accept-Ranges", "bytes");

  const rangeHeader = req.headers.range;

  if (rangeHeader) {
    const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10) || 0;
    const end = endStr ? Math.min(parseInt(endStr, 10), fileSize - 1) : fileSize - 1;

    if (start > end || start >= fileSize) {
      res.status(416).setHeader("Content-Range", `bytes */${fileSize}`).end();
      return;
    }

    const chunkSize = end - start + 1;
    res.status(206);
    res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    res.setHeader("Content-Length", chunkSize);
    res.setHeader("Content-Disposition", "inline");

    /* GridFS end is exclusive, HTTP Range end is inclusive */
    const stream = openMediaGridFsDownloadStream(id, { start, end: end + 1 });
    if (!stream) {
      res.status(404);
      throw new Error("Media file not found");
    }
    stream.on("error", () => { if (!res.headersSent) res.status(500).end(); else res.end(); });
    stream.pipe(res);
    return;
  }

  res.setHeader("Content-Length", fileSize);
  res.setHeader("Content-Disposition", "inline");

  const stream = openMediaGridFsDownloadStream(id);
  if (!stream) {
    res.status(404);
    throw new Error("Media file not found");
  }

  stream.on("error", () => {
    if (!res.headersSent) {
      res.status(404).json({ message: "Media file not found" });
    } else {
      res.end();
    }
  });

  stream.pipe(res);
});

export const deleteMediaAsset = asyncHandler(async (req, res) => {
  const { url, assetType } = req.body || {};

  if (typeof url !== "string" || !url.trim()) {
    res.status(400);
    throw new Error("Media URL is required");
  }

  const cleanedUrl = url.trim();

  const deletedFromCloudinary = await deleteCloudinaryAsset(cleanedUrl, assetType);

  let deletedFromGridFs = false;
  if (!deletedFromCloudinary) {
    const gridFsId = extractGridFsIdFromMediaUrl(cleanedUrl);
    if (gridFsId) {
      deletedFromGridFs = await deleteMediaGridFsFile(gridFsId);
    }
  }

  const deletedFromLocal =
    deletedFromCloudinary || deletedFromGridFs ? false : await deleteLocalAssetByUrl(cleanedUrl);

  res.json({
    deleted: deletedFromCloudinary || deletedFromGridFs || deletedFromLocal,
  });
});











