import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    brandStatement: {
      type: String,
      default: "",
      maxlength: 600,
      trim: true,
    },
    availability: {
      type: String,
      enum: ["open", "busy", "limited"],
      default: "open",
    },
    timezone: {
      type: String,
      default: "Africa/Lagos",
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 80,
    },
    desiredRoles: {
      type: [String],
      default: [],
    },
    jobSearchStatus: {
      type: String,
      enum: ["actively-looking", "open", "not-looking"],
      default: "actively-looking",
    },
    preferredWorkModes: {
      type: [String],
      default: ["remote"],
    },
    targetRegions: {
      type: [String],
      default: [],
    },
    requiresVisaSponsorship: {
      type: Boolean,
      default: false,
    },
    willingToRelocate: {
      type: Boolean,
      default: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      x: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
