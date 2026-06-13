import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
      maxlength: 420,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30000,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ updatedAt: -1 });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
