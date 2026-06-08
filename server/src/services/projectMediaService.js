import ProjectMedia from "../models/projectMediaModel.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const isHttpUrl = (value) => /^https?:\/\//i.test(value);

const extractCloudinaryId = (assetUrl = "") => {
  const url = sanitizeString(assetUrl);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("cloudinary.com")) {
      return "";
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) {
      return "";
    }

    const afterUpload = [...parts.slice(uploadIndex + 1)];
    if (afterUpload[0] && /^v\d+$/i.test(afterUpload[0])) {
      afterUpload.shift();
    }

    const joined = afterUpload.join("/");
    return joined.replace(/\.[^./]+$/, "");
  } catch {
    return "";
  }
};

const inferFileName = (assetUrl = "") => {
  const url = sanitizeString(assetUrl);
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const value = parsed.pathname.split("/").pop() || "";
    return decodeURIComponent(value);
  } catch {
    return "";
  }
};

const normaliseVideoPayload = (payload = {}, userId = null) => {
  const url = sanitizeString(payload.url);

  if (!url || !isHttpUrl(url)) {
    return null;
  }

  return {
    url,
    cloudinaryId: sanitizeString(payload.cloudinaryId) || extractCloudinaryId(url),
    fileName: sanitizeString(payload.fileName) || inferFileName(url),
    mimeType: sanitizeString(payload.mimeType),
    title: sanitizeString(payload.title),
    uploadDate: new Date(),
    uploadedBy: userId || null,
  };
};

const normaliseImagePayload = (payload = {}, userId = null) => {
  const url = sanitizeString(payload.url);

  if (!url || !isHttpUrl(url)) {
    return null;
  }

  return {
    url,
    cloudinaryId: sanitizeString(payload.cloudinaryId) || extractCloudinaryId(url),
    fileName: sanitizeString(payload.fileName) || inferFileName(url),
    mimeType: sanitizeString(payload.mimeType),
    uploadDate: new Date(),
    uploadedBy: userId || null,
  };
};

export const getOrCreateProjectMedia = async () => {
  let doc = await ProjectMedia.findOne().sort({ createdAt: 1 });

  if (!doc) {
    doc = await ProjectMedia.create({
      projectVideos: [],
      projectImages: [],
    });
  }

  return doc;
};

export const appendProjectVideo = async ({ payload, userId }) => {
  const doc = await getOrCreateProjectMedia();
  const videoItem = normaliseVideoPayload(payload, userId);

  if (!videoItem) {
    const error = new Error("A valid video URL is required");
    error.statusCode = 400;
    throw error;
  }

  doc.projectVideos.unshift(videoItem);
  await doc.save();

  return doc;
};

export const appendProjectImages = async ({ items, userId }) => {
  const doc = await getOrCreateProjectMedia();
  const imageItems = Array.isArray(items)
    ? items
        .map((item) => normaliseImagePayload(item, userId))
        .filter(Boolean)
    : [];

  if (!imageItems.length) {
    const error = new Error("At least one valid image URL is required");
    error.statusCode = 400;
    throw error;
  }

  doc.projectImages = [...imageItems, ...doc.projectImages];
  await doc.save();

  return doc;
};

export const removeProjectVideoById = async (mediaId) => {
  const doc = await getOrCreateProjectMedia();
  const index = doc.projectVideos.findIndex((item) => String(item._id) === String(mediaId));

  if (index === -1) {
    return { doc, removed: null };
  }

  const [removed] = doc.projectVideos.splice(index, 1);
  await doc.save();

  return { doc, removed };
};

export const removeProjectImageById = async (mediaId) => {
  const doc = await getOrCreateProjectMedia();
  const index = doc.projectImages.findIndex((item) => String(item._id) === String(mediaId));

  if (index === -1) {
    return { doc, removed: null };
  }

  const [removed] = doc.projectImages.splice(index, 1);
  await doc.save();

  return { doc, removed };
};
