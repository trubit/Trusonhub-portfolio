import Certificate from "../models/Certificate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCertificates = asyncHandler(async (_req, res) => {
  const certs = await Certificate.find().sort({ order: 1, createdAt: -1 }).lean();
  res.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=60");
  res.json(certs);
});

export const createCertificate = asyncHandler(async (req, res) => {
  const { title, issuer, issueDate, credentialUrl, imageUrl, cloudinaryId, description, order } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("title is required");
  }

  const cert = await Certificate.create({
    title,
    issuer: issuer || "",
    issueDate: issueDate || "",
    credentialUrl: credentialUrl || "",
    imageUrl: imageUrl || "",
    cloudinaryId: cloudinaryId || "",
    description: description || "",
    order: Number(order || 0),
  });

  res.status(201).json(cert);
});

export const updateCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  const allowed = ["title", "issuer", "issueDate", "credentialUrl", "imageUrl", "cloudinaryId", "description", "order"];
  for (const key of allowed) {
    if (typeof req.body[key] !== "undefined") {
      cert[key] = req.body[key];
    }
  }

  await cert.save();
  res.json(cert);
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  await cert.deleteOne();
  res.status(204).send();
});
