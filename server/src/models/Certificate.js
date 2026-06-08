import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    issuer: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    issueDate: {
      type: String,
      default: "",
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    cloudinaryId: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
