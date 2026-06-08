import { Router } from "express";

import {
  createCertificate,
  deleteCertificate,
  getCertificates,
  updateCertificate,
} from "../controllers/certificateController.js";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";

const router = Router();

router.get("/", getCertificates);
router.post("/", protect, requireAdmin, createCertificate);
router.patch("/:id", protect, requireAdmin, updateCertificate);
router.delete("/:id", protect, requireAdmin, deleteCertificate);

export default router;
