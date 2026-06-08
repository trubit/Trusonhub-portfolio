import dotenv from "dotenv";
dotenv.config();

import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoose from "mongoose";
import morgan from "morgan";

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
  /^http:\/\/localhost:\d{2,5}$/i.test(origin) || /^http:\/\/127\.0\.0\.1:\d{2,5}$/i.test(origin);

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
    frameguard: false,
  }),
);

app.use(hpp());
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/project-media", projectMediaRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Server boot failed:", error.message);
  process.exit(1);
});
