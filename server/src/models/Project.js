import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    techStack: {
      type: [String],
      default: [],
    },
    repoUrl: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    fullDescription: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    videoUrls: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

