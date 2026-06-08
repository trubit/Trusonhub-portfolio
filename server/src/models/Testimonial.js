import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    role: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    cloudinaryId: {
      type: String,
      default: "",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
