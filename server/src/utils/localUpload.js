import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..", "..");
const uploadsRoot = path.join(serverRoot, "uploads");

const ensureUploadDir = async (folder) => {
  await fs.mkdir(folder, { recursive: true });
};

const getSafeExtension = (originalName = "", mimetype = "") => {
  const byName = path.extname(originalName).toLowerCase();
  if (byName) {
    return byName;
  }

  const typeMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "video/mp4": ".mp4",
  };

  return typeMap[mimetype] || ".bin";
};

export const saveBufferToLocalUploads = async ({ file, category }) => {
  const root = path.join(uploadsRoot, category);
  await ensureUploadDir(root);

  const extension = getSafeExtension(file.originalname, file.mimetype);
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const absPath = path.join(root, fileName);
  await fs.writeFile(absPath, file.buffer);

  return `/uploads/${category}/${fileName}`;
};
