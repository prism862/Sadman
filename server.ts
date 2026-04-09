import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "database.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    if (!data || data.trim() === "") {
      return { products: [], bannerImages: {} };
    }
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return { products: [], bannerImages: {} };
    }
    console.error("Error reading database:", error);
    return { products: [], bannerImages: {} };
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes for Data Persistence
  app.get("/api/data", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const data = await readDB();
    res.json(data);
  });

  app.post("/api/products", async (req, res) => {
    const { products } = req.body;
    const db = await readDB();
    db.products = products;
    await writeDB(db);
    res.json({ success: true });
  });

  app.post("/api/settings", async (req, res) => {
    const { bannerImages } = req.body;
    const db = await readDB();
    db.bannerImages = bannerImages;
    await writeDB(db);
    res.json({ success: true });
  });

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
