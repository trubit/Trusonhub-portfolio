import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { isAdminEmail } from "../config/admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bootstrapAdminContent } from "../utils/bootstrapAdminContent.js";

const toBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
};

export const getPublicProfile = asyncHandler(async (_req, res) => {
  const user = await User.findOne().sort({ createdAt: 1 }).select("-password");
  if (!user) {
    res.json({
      user: null,
      profile: null,
      featuredProjects: [],
    });
    return;
  }

  const profile = await Profile.findOne({ user: user._id });
  const featuredProjects = await Project.find({ user: user._id, featured: true }).sort({
    updatedAt: -1,
  });

  res.json({
    user,
    profile,
    featuredProjects,
  });
});

export const getMyProfile = asyncHandler(async (req, res) => {
  if (isAdminEmail(req.user.email)) {
    await bootstrapAdminContent(req.user);
  }

  let profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    profile = await Profile.create({ user: req.user._id });
  }

  res.json(profile);
});

export const upsertMyProfile = asyncHandler(async (req, res) => {
  const payload = {
    brandStatement: req.body.brandStatement || "",
    availability: req.body.availability || "open",
    timezone: req.body.timezone || "Africa/Lagos",
    yearsOfExperience: Number(req.body.yearsOfExperience || 0),
    desiredRoles: Array.isArray(req.body.desiredRoles) ? req.body.desiredRoles : [],
    jobSearchStatus: req.body.jobSearchStatus || "actively-looking",
    preferredWorkModes: Array.isArray(req.body.preferredWorkModes) ? req.body.preferredWorkModes : [],
    targetRegions: Array.isArray(req.body.targetRegions) ? req.body.targetRegions : [],
    requiresVisaSponsorship: toBoolean(req.body.requiresVisaSponsorship, false),
    willingToRelocate: toBoolean(req.body.willingToRelocate, true),
    languages: Array.isArray(req.body.languages) ? req.body.languages : [],
    skills: Array.isArray(req.body.skills) ? req.body.skills : [],
    services: Array.isArray(req.body.services) ? req.body.services : [],
    socialLinks: {
      linkedin: req.body.socialLinks?.linkedin || "",
      github: req.body.socialLinks?.github || "",
      x: req.body.socialLinks?.x || "",
      website: req.body.socialLinks?.website || "",
    },
  };

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: payload },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.json(profile);
});
