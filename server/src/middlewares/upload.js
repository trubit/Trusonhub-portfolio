import multer from "multer";

const storage = multer.memoryStorage();

const allowedDocumentMimeTypes = [
  "application/pdf",
  "application/x-pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/rtf",
  "text/rtf",
  "text/plain",
  "application/vnd.oasis.opendocument.text",
];

const allowedDocumentExtensions = [".pdf", ".doc", ".docx", ".rtf", ".txt", ".odt"];

const fileFilter = (_req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    ...allowedDocumentMimeTypes,
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  const lowerName = String(file.originalname || "").toLowerCase();
  const hasAllowedDocumentExtension = allowedDocumentExtensions.some((extension) =>
    lowerName.endsWith(extension),
  );
  const looksLikeDocument =
    hasAllowedDocumentExtension &&
    ["application/octet-stream", "binary/octet-stream"].includes(file.mimetype);

  if (allowed.includes(file.mimetype) || looksLikeDocument) {
    cb(null, true);
    return;
  }

  cb(new Error("Unsupported file type"));
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter,
});
