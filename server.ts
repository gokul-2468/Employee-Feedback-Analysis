import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { connectMongoDB } from "./backend/models/feedback";
import feedbackRoutes from "./backend/routes/feedbackRoutes";
import { errorHandler } from "./backend/middleware/errorHandler";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parse middleware
app.use(express.json());

// Initialize database (MongoDB connection or file system dual fallback)
connectMongoDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    database: process.env.MONGODB_URI ? "MongoDB" : "Local JSON Storage",
    geminiActive: !!process.env.GEMINI_API_KEY
  });
});

// Bind all modular routes
app.use(feedbackRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// FRONTEND SERVING / VITE INTEGRATION
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    // Mount Vite's dev asset middleware
    app.use(vite.middlewares);
    console.log("🚀 Vite middleware mounted in Development mode.");
  } else {
    // Serve production static assets from dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Serving production built assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 Smart Feedback Server active at http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("🔴 Server crash during startup:", err);
});
