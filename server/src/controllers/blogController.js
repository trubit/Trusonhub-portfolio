import BlogPost from "../models/BlogPost.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");

const toSlug = (input = "") =>
  sanitizeString(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toStringArray = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => sanitizeString(item))
        .filter(Boolean)
    : [];

export const getPublicBlogPosts = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
  res.json(posts);
});

export const getAdminBlogPosts = asyncHandler(async (_req, res) => {
  const posts = await BlogPost.find().sort({ updatedAt: -1 });
  res.json(posts);
});

export const createBlogPost = asyncHandler(async (req, res) => {
  const title = sanitizeString(req.body?.title);
  const content = sanitizeString(req.body?.content);
  const excerpt = sanitizeString(req.body?.excerpt);

  if (!title || !content) {
    res.status(400);
    throw new Error("title and content are required");
  }

  const slugInput = sanitizeString(req.body?.slug) || title;
  const slug = toSlug(slugInput);

  if (!slug) {
    res.status(400);
    throw new Error("A valid slug is required");
  }

  const exists = await BlogPost.findOne({ slug });
  if (exists) {
    res.status(409);
    throw new Error("Blog post with this slug already exists");
  }

  const payload = {
    title,
    slug,
    excerpt,
    content,
    tags: toStringArray(req.body?.tags),
    published: typeof req.body?.published === "boolean" ? req.body.published : true,
    publishedAt: req.body?.publishedAt ? new Date(req.body.publishedAt) : new Date(),
    createdBy: req.user?._id || null,
  };

  const post = await BlogPost.create(payload);
  res.status(201).json(post);
});

export const updateBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  if (typeof req.body?.title !== "undefined") {
    post.title = sanitizeString(req.body.title);
  }

  if (typeof req.body?.excerpt !== "undefined") {
    post.excerpt = sanitizeString(req.body.excerpt);
  }

  if (typeof req.body?.content !== "undefined") {
    post.content = sanitizeString(req.body.content);
  }

  if (typeof req.body?.slug !== "undefined") {
    const nextSlug = toSlug(req.body.slug || post.title);
    if (!nextSlug) {
      res.status(400);
      throw new Error("A valid slug is required");
    }

    if (nextSlug !== post.slug) {
      const exists = await BlogPost.findOne({ slug: nextSlug, _id: { $ne: post._id } });
      if (exists) {
        res.status(409);
        throw new Error("Blog post with this slug already exists");
      }
      post.slug = nextSlug;
    }
  }

  if (Array.isArray(req.body?.tags)) {
    post.tags = toStringArray(req.body.tags);
  }

  if (typeof req.body?.published === "boolean") {
    post.published = req.body.published;
  }

  if (typeof req.body?.publishedAt !== "undefined") {
    post.publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt) : post.publishedAt;
  }

  await post.save();

  res.json(post);
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  await post.deleteOne();
  res.status(204).send();
});
