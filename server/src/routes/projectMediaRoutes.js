import { Router } from "express";

import {
  addProjectImages,
  addProjectVideo,
  deleteProjectImage,
  deleteProjectVideo,
  getProjectMedia,
} from "../controllers/projectMediaController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", getProjectMedia);
router.post("/videos", protect, requireAdmin, addProjectVideo);
router.post("/images", protect, requireAdmin, addProjectImages);
router.delete("/videos/:mediaId", protect, requireAdmin, deleteProjectVideo);
router.delete("/images/:mediaId", protect, requireAdmin, deleteProjectImage);

export default router;
