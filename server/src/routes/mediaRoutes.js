import { Router } from "express";

import { getMediaCenter, upsertMediaCenter } from "../controllers/mediaController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", getMediaCenter);
router.put("/", protect, requireAdmin, upsertMediaCenter);

export default router;
