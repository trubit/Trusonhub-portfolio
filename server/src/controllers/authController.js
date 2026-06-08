import User from "../models/User.js";
import { isAdminEmail, normalizeEmail } from "../config/admin.js";
import Profile from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bootstrapAdminContent } from "../utils/bootstrapAdminContent.js";
import { signToken } from "../utils/token.js";

const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  fullName: userDoc.fullName,
  email: userDoc.email,
  phoneNumber: userDoc.phoneNumber,
  headline: userDoc.headline,
  location: userDoc.location,
  bio: userDoc.bio,
  avatarUrl: userDoc.avatarUrl,
  resumeUrl: userDoc.resumeUrl,
  role: userDoc.role,
});

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("fullName, email and password are required");
  }

  if (isAdminEmail(normalizedEmail)) {
    res.status(403);
    throw new Error("Admin account cannot be created from public signup");
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409);
    throw new Error("Account with this email already exists");
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    phoneNumber: phoneNumber || "",
    role: "editor",
  });

  const token = signToken(user._id);
  res.status(201).json({ token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!email) {
    res.status(400);
    throw new Error("email is required");
  }

  // ── Owner email: no password required ──────────────────────
  if (isAdminEmail(normalizedEmail)) {
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        fullName: "Ezika Trust Chidi",
        email: normalizedEmail,
        role: "admin",
      });
    } else if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    await bootstrapAdminContent(user);

    const token = signToken(user._id);
    return res.json({ token, user: sanitizeUser(user) });
  }

  // ── Any other email: password is required ──────────────────
  if (!password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  res.status(403);
  throw new Error("Only the approved admin account can sign in");
});

export const me = asyncHandler(async (req, res) => {
  if (isAdminEmail(req.user.email)) {
    await bootstrapAdminContent(req.user);
  }

  const profile = await Profile.findOne({ user: req.user._id });
  res.json({ user: sanitizeUser(req.user), profile });
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ["fullName", "phoneNumber", "headline", "location", "bio", "avatarUrl", "resumeUrl"];

  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") {
      req.user[key] = req.body[key];
    }
  }

  await req.user.save();
  res.json({ user: sanitizeUser(req.user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("currentPassword and newPassword are required");
  }

  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});
