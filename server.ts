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

const DB_PATH = path.join(process.cwd(), "db");

async function ensureDbDir() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
  } catch (e) {
    console.error("Failed to create DB directory:", e);
  }
}

async function readDb(file: string) {
  await ensureDbDir();
  try {
    const filePath = path.join(DB_PATH, file);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error reading ${file}:`, e);
    return null;
  }
}

async function writeDb(file: string, data: any) {
  await ensureDbDir();
  try {
    const filePath = path.join(DB_PATH, file);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Successfully wrote to ${file}`);
  } catch (e) {
    console.error(`Error writing to ${file}:`, e);
    throw e;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Products API
  app.get("/api/products", async (req, res) => {
    console.log("GET /api/products");
    const products = await readDb("products.json");
    res.json(products || []);
  });

  app.post("/api/products", async (req, res) => {
    console.log("POST /api/products", Array.isArray(req.body) ? `Array of ${req.body.length}` : typeof req.body);
    try {
      if (!Array.isArray(req.body)) {
        throw new Error("Invalid data format: expected array");
      }
      await writeDb("products.json", req.body);
      res.json({ success: true });
    } catch (e) {
      console.error("Failed to save products:", e);
      res.status(500).json({ error: e instanceof Error ? e.message : "Failed to save products" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    console.log("GET /api/orders");
    const orders = await readDb("orders.json");
    res.json(orders || []);
  });

  app.post("/api/orders", async (req, res) => {
    console.log("POST /api/orders");
    try {
      await writeDb("orders.json", req.body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save orders" });
    }
  });

  // Settings API
  app.get("/api/settings", async (req, res) => {
    console.log("GET /api/settings");
    const settings = await readDb("settings.json");
    res.json(settings || {});
  });

  app.post("/api/settings", async (req, res) => {
    console.log("POST /api/settings");
    try {
      await writeDb("settings.json", req.body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to save settings" });
    }
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
