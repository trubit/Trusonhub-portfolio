import { Router } from "express";

import {
  createTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "../controllers/testimonialController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", getTestimonials);
router.post("/", protect, requireAdmin, createTestimonial);
router.patch("/:id", protect, requireAdmin, updateTestimonial);
router.delete("/:id", protect, requireAdmin, deleteTestimonial);

export default router;
