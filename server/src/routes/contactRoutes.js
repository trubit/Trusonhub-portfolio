import { Router } from "express";

import {
  deleteContactMessage,
  getContactMessages,
  submitContactMessage,
  updateContactMessage,
} from "../controllers/contactController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.post("/", submitContactMessage);
router.get("/admin", protect, requireAdmin, getContactMessages);
router.patch("/admin/:id", protect, requireAdmin, updateContactMessage);
router.delete("/admin/:id", protect, requireAdmin, deleteContactMessage);

export default router;
