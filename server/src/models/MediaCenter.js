import mongoose from "mongoose";

const featuredInterviewSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "youtube"],
      default: "video",
    },
    url: {
      type: String,
      default: "",
      trim: true,
    },
    embedUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const interviewVideoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const youtubeInterviewSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    embedUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const mediaCenterSchema = new mongoose.Schema(
  {
    profilePhoto: {
      type: String,
      default: "",
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    interviewVideos: {
      type: [interviewVideoSchema],
      default: [],
    },
    youtubeInterviews: {
      type: [youtubeInterviewSchema],
      default: [],
    },
    featuredInterview: {
      type: featuredInterviewSchema,
      default: null,
    },
    cvPdf: {
      type: String,
      default: "",
      trim: true,
    },
    resumePdf: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

const MediaCenter = mongoose.model("MediaCenter", mediaCenterSchema);

export default MediaCenter;
