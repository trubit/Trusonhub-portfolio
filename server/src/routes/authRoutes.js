import { Router } from "express";

import { changePassword, login, me, register, updateMe } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);

export default router;
