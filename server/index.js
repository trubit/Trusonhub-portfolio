import dotenv from "dotenv";
dotenv.config();

import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoose from "mongoose";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectToDatabase } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import certificateRoutes from "./src/routes/certificateRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import projectMediaRoutes from "./src/routes/projectMediaRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { notFound } from "./src/middlewares/notFound.js";

const app = express();
const port = Number(process.env.PORT || 5000);

const allowList = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin) =>
  /^http:\/\/localhost:\d{2,5}$/i.test(origin) ||
  /^http:\/\/127\.0\.0\.1:\d{2,5}$/i.test(origin) ||
  /^http:\/\/(10\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3})\.\d{1,3}:\d{2,5}$/.test(origin);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowList.includes(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin))
      ) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    frameguard: { action: "deny" },
    hsts: process.env.NODE_ENV === "production"
      ? { maxAge: 31_536_000, includeSubDomains: true }
      : false,
  }),
);

app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(hpp());

// Rate limiting — tight window on auth, relaxed on all other API calls
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again in 15 minutes." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down." },
});

// Contact form: generous enough for genuine users retrying on errors,
// but tight enough to block spam bots.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please try again in 15 minutes." },
});

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "trusonhub-portfolio-api",
    dbState: mongoose.connection.readyState,
    now: new Date().toISOString(),
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", apiLimiter, profileRoutes);
app.use("/api/projects", apiLimiter, projectRoutes);
app.use("/api/blog", apiLimiter, blogRoutes);
app.use("/api/project-media", apiLimiter, projectMediaRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/media", apiLimiter, mediaRoutes);
app.use("/api/uploads", apiLimiter, uploadRoutes);
app.use("/api/certificates", apiLimiter, certificateRoutes);
app.use("/api/testimonials", apiLimiter, testimonialRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  if (!process.env.ADMIN_PASSWORD) {
    console.error("FATAL: ADMIN_PASSWORD environment variable is not set. Set it in .env or your hosting platform.");
    process.exit(1);
  }
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server boot failed:", error.message);
  process.exit(1);
});
