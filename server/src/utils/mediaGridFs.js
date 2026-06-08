import { PassThrough } from "stream";

import mongoose from "mongoose";

const MEDIA_BUCKET = "mediaAssets";

const getBucket = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not ready");
  }

  return new mongoose.mongo.GridFSBucket(db, { bucketName: MEDIA_BUCKET });
};

const toObjectId = (value) => {
  try {
    return new mongoose.Types.ObjectId(value);
  } catch {
    return null;
  }
};

export const saveMediaBufferToGridFs = async ({
  buffer,
  fileName,
  mimeType,
  assetType,
}) => {
  const bucket = getBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileName, {
      contentType: mimeType,
      metadata: {
        assetType,
        mimeType,
      },
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve(String(uploadStream.id));
    });

    const input = new PassThrough();
    input.end(buffer);
    input.pipe(uploadStream);
  });
};

export const openMediaGridFsDownloadStream = (id, options = {}) => {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }

  const bucket = getBucket();
  return bucket.openDownloadStream(objectId, options);
};

export const getMediaGridFsFileInfo = async (id) => {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }

  const bucket = getBucket();
  const files = await bucket.find({ _id: objectId }).toArray();
  return files[0] || null;
};

export const deleteMediaGridFsFile = async (id) => {
  const objectId = toObjectId(id);
  if (!objectId) {
    return false;
  }

  const bucket = getBucket();

  try {
    await bucket.delete(objectId);
    return true;
  } catch (error) {
    if (error?.message?.includes("FileNotFound")) {
      return false;
    }
    throw error;
  }
};

export const extractGridFsIdFromMediaUrl = (url) => {
  if (typeof url !== "string" || !url.trim()) {
    return null;
  }

  const parsePath = (pathname) => {
    const match = pathname.match(/\/api\/uploads\/media\/file\/([a-f0-9]{24})/i);
    return match?.[1] || null;
  };

  if (url.startsWith("/")) {
    return parsePath(url);
  }

  try {
    const parsed = new URL(url);
    return parsePath(parsed.pathname);
  } catch {
    return null;
  }
};

