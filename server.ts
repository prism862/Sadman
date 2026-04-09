import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Root API Route
  app.get("/api", async (req, res) => {
    const handler = (await import("./api/index.js")).default;
    // @ts-ignore
    return handler(req, res);
  });

  // API Route for Order Notifications
  app.post("/api/order-notification", async (req, res) => {
    // Import the handler dynamically to avoid issues with Vercel types in local dev
    const handler = (await import("./api/order-notification.js")).default;
    // @ts-ignore - req/res types are compatible enough for this use case
    return handler(req, res);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
