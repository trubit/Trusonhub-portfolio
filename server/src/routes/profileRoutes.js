import { Router } from "express";

import {
  getMyProfile,
  getPublicProfile,
  upsertMyProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/public", getPublicProfile);
router.get("/me", protect, requireAdmin, getMyProfile);
router.put("/me", protect, requireAdmin, upsertMyProfile);

export default router;
