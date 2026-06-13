import Testimonial from "../models/Testimonial.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await Testimonial.find().sort({ featured: -1, order: 1, createdAt: -1 }).lean();
  res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=60");
  res.json(testimonials);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, company, quote, avatarUrl, cloudinaryId, featured, order } = req.body;

  if (!name || !quote) {
    res.status(400);
    throw new Error("name and quote are required");
  }

  const testimonial = await Testimonial.create({
    name,
    role: role || "",
    company: company || "",
    quote,
    avatarUrl: avatarUrl || "",
    cloudinaryId: cloudinaryId || "",
    featured: Boolean(featured),
    order: Number(order || 0),
  });

  res.status(201).json(testimonial);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  const allowed = ["name", "role", "company", "quote", "avatarUrl", "cloudinaryId", "featured", "order"];
  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") {
      testimonial[key] = req.body[key];
    }
  }

  await testimonial.save();
  res.json(testimonial);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  await testimonial.deleteOne();
  res.status(204).send();
});
