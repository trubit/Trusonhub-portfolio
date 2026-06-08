import { asyncHandler } from "../utils/asyncHandler.js";
import {
  appendProjectImages,
  appendProjectVideo,
  getOrCreateProjectMedia,
  removeProjectImageById,
  removeProjectVideoById,
} from "../services/projectMediaService.js";

export const getProjectMedia = asyncHandler(async (_req, res) => {
  const doc = await getOrCreateProjectMedia();
  res.json(doc);
});

export const addProjectVideo = asyncHandler(async (req, res) => {
  const doc = await appendProjectVideo({
    payload: req.body || {},
    userId: req.user?._id || null,
  });

  res.status(201).json(doc);
});

export const addProjectImages = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  const doc = await appendProjectImages({
    items,
    userId: req.user?._id || null,
  });

  res.status(201).json(doc);
});

export const deleteProjectVideo = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  const { doc, removed } = await removeProjectVideoById(mediaId);
  if (!removed) {
    res.status(404);
    throw new Error("Project video not found");
  }

  res.json({
    removed,
    projectMedia: doc,
  });
});

export const deleteProjectImage = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  const { doc, removed } = await removeProjectImageById(mediaId);
  if (!removed) {
    res.status(404);
    throw new Error("Project image not found");
  }

  res.json({
    removed,
    projectMedia: doc,
  });
});
