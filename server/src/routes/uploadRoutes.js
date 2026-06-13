import { Router } from "express";

import {
  deleteMediaAsset,
  getMediaAsset,
  uploadAvatar,
  uploadMediaDocument,
  uploadMediaImage,
  uploadMediaVideo,
  uploadProjectMedia,
} from "../controllers/uploadController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.post("/avatar", protect, requireAdmin, upload.single("file"), uploadAvatar);
router.post("/project-media", protect, requireAdmin, upload.single("file"), uploadProjectMedia);
router.post("/media/image", protect, requireAdmin, upload.single("file"), uploadMediaImage);
router.post("/media/video", protect, requireAdmin, upload.single("file"), uploadMediaVideo);
router.post("/media/document", protect, requireAdmin, upload.single("file"), uploadMediaDocument);
// X-Frame-Options: DENY (set globally by helmet) blocks this file from being
// embedded in an <iframe>.  Remove it for the file-serving endpoint only so
// the admin CV/resume preview works while every other route stays protected.
router.get("/media/file/:id", (_req, res, next) => { res.removeHeader("X-Frame-Options"); next(); }, getMediaAsset);
router.delete("/media", protect, requireAdmin, deleteMediaAsset);

export default router;
