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
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // If file exists but is invalid JSON, try to read from backup if it exists
      // For now, we'll just throw to prevent overwriting with defaults
      throw new Error("Database file is corrupted");
    }
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return { products: [], bannerImages: {} };
    }
    console.error("Error reading database:", error);
    throw error;
  }
}

let isWriting = false;
const writeQueue: any[] = [];

async function processWriteQueue() {
  if (isWriting || writeQueue.length === 0) return;
  isWriting = true;
  const { data, resolve, reject } = writeQueue.shift();

  try {
    const json = JSON.stringify(data, null, 2);
    if (!json || json === "{}" || json === "[]") {
      throw new Error("Attempted to write empty or invalid data to database");
    }
    
    // Atomic write using a temp file
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, json, "utf-8");
    await fs.rename(tempPath, DB_PATH);
    
    console.log(`[${new Date().toISOString()}] Database updated successfully.`);
    resolve();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] CRITICAL: Error writing database:`, error);
    reject(error);
  } finally {
    isWriting = false;
    processWriteQueue();
  }
}

async function writeDB(data: any) {
  return new Promise<void>((resolve, reject) => {
    writeQueue.push({ data, resolve, reject });
    processWriteQueue();
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Router
  const apiRouter = express.Router();

  apiRouter.get("/data", async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] GET /api/data`);
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const data = await readDB();
      res.json(data);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] API Error (/api/data):`, error);
      res.status(500).json({ error: "Failed to read database" });
    }
  });

  apiRouter.post("/products", async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] POST /api/products`);
      const { products } = req.body;
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid or missing products in request body" });
      }
      const db = await readDB();
      db.products = products;
      await writeDB(db);
      res.json({ success: true });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] API Error (/api/products):`, error);
      res.status(500).json({ error: (error as Error).message || "Failed to update products" });
    }
  });

  apiRouter.post("/settings", async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] POST /api/settings`);
      const { bannerImages } = req.body;
      if (!bannerImages || typeof bannerImages !== 'object') {
        return res.status(400).json({ error: "Invalid or missing bannerImages in request body" });
      }
      const db = await readDB();
      db.bannerImages = bannerImages;
      await writeDB(db);
      res.json({ success: true });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] API Error (/api/settings):`, error);
      res.status(500).json({ error: (error as Error).message || "Failed to update settings" });
    }
  });

  apiRouter.get("/", async (req, res) => {
    try {
      const handler = (await import("./api/index.js")).default;
      // @ts-ignore
      return handler(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load API handler" });
    }
  });

  apiRouter.post("/order-notification", async (req, res) => {
    try {
      const handler = (await import("./api/order-notification.js")).default;
      // @ts-ignore
      return handler(req, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to load notification handler" });
    }
  });

  // Catch-all for undefined API routes
  apiRouter.all("*", (req, res) => {
    console.warn(`[${new Date().toISOString()}] 404 on API route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use("/api", apiRouter);

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
