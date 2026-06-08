import { Router } from "express";

import {
  createBlogPost,
  deleteBlogPost,
  getAdminBlogPosts,
  getPublicBlogPosts,
  updateBlogPost,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/public", getPublicBlogPosts);
router.get("/admin", protect, requireAdmin, getAdminBlogPosts);
router.post("/", protect, requireAdmin, createBlogPost);
router.patch("/:id", protect, requireAdmin, updateBlogPost);
router.delete("/:id", protect, requireAdmin, deleteBlogPost);

export default router;
