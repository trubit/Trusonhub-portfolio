import mongoose from "mongoose";

const baseAssetSchemaFields = {
  url: {
    type: String,
    required: true,
    trim: true,
  },
  cloudinaryId: {
    type: String,
    default: "",
    trim: true,
  },
  fileName: {
    type: String,
    default: "",
    trim: true,
  },
  mimeType: {
    type: String,
    default: "",
    trim: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
};

const projectVideoSchema = new mongoose.Schema(
  {
    ...baseAssetSchemaFields,
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
  },
  { _id: true },
);

const projectImageSchema = new mongoose.Schema(
  {
    ...baseAssetSchemaFields,
  },
  { _id: true },
);

const projectMediaSchema = new mongoose.Schema(
  {
    projectVideos: {
      type: [projectVideoSchema],
      default: [],
    },
    projectImages: {
      type: [projectImageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const ProjectMedia = mongoose.model("ProjectMedia", projectMediaSchema);

export default ProjectMedia;
