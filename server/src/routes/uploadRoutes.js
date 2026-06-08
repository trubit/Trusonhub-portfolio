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
router.get("/media/file/:id", getMediaAsset);
router.delete("/media", protect, requireAdmin, deleteMediaAsset);

export default router;
