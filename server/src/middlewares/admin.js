import { asyncHandler } from "../utils/asyncHandler.js";
import { isAdminEmail, normalizeEmail } from "../config/admin.js";

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const email = normalizeEmail(req.user?.email);
  const hasAdminRole = req.user?.role === "admin";

  if (!hasAdminRole || !isAdminEmail(email)) {
    res.status(403);
    throw new Error("Forbidden: admin access required");
  }

  next();
});
