import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  if (
    mongoUri.includes("<") ||
    mongoUri.includes(">") ||
    mongoUri.includes("your_") ||
    mongoUri.includes("username:password@<cluster>")
  ) {
    throw new Error(
      "Invalid MONGODB_URI. Replace placeholder values with a real MongoDB Atlas connection string from Atlas > Connect > Drivers.",
    );
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    maxPoolSize: 100,        // handle bursts of concurrent requests
    minPoolSize: 10,         // keep connections warm
    maxIdleTimeMS: 45_000,   // recycle idle connections after 45 s
    socketTimeoutMS: 45_000,
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("MongoDB connected");
};
