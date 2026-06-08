import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "");
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Unauthorized: invalid or expired token");
  }

  const user = await User.findById(decoded.sub).select("-password");
  if (!user) {
    res.status(401);
    throw new Error("Unauthorized: account not found");
  }

  req.user = user;
  next();
});

