import { Router } from "express";

import {
  createProject,
  deleteProject,
  getMyProjects,
  getPublicProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/public", getPublicProjects);
router.get("/me", protect, requireAdmin, getMyProjects);
router.post("/", protect, requireAdmin, createProject);
router.patch("/:id", protect, requireAdmin, updateProject);
router.delete("/:id", protect, requireAdmin, deleteProject);

export default router;
