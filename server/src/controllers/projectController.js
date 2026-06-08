import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPublicProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ featured: -1, updatedAt: -1 });
  res.json(projects);
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, summary, fullDescription, category, techStack, repoUrl, liveUrl, coverImageUrl, imageUrls, videoUrls, featured } = req.body;

  if (!title || !summary) {
    res.status(400);
    throw new Error("title and summary are required");
  }

  const project = await Project.create({
    user: req.user._id,
    title,
    summary,
    techStack: Array.isArray(techStack) ? techStack : [],
    category: category || "",
    fullDescription: fullDescription || "",
    repoUrl: repoUrl || "",
    liveUrl: liveUrl || "",
    coverImageUrl: coverImageUrl || "",
    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    videoUrls: Array.isArray(videoUrls) ? videoUrls : [],
    featured: Boolean(featured),
  });

  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const allowed = ["title", "summary", "fullDescription", "category", "techStack", "repoUrl", "liveUrl", "coverImageUrl", "imageUrls", "videoUrls", "featured"];
  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") {
      project[key] = req.body[key];
    }
  }

  await project.save();
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await project.deleteOne();
  res.status(204).send();
});

