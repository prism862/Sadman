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

  // API Route for Order Notifications
  app.post("/api/order-notification", async (req, res) => {
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({ error: "Order data is required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsList = order.items
      .map(
        (item: any) =>
          `- ${item.title} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ${item.price} BDT`
      )
      .join("\n");

    const mailOptions = {
      from: `"PRISM Store" <${process.env.EMAIL_USER}>`,
      to: "sadmansakibchy99@gmail.com",
      subject: `New Order Received: ${order.id}`,
      text: `
        New Order Details:
        Order ID: ${order.id}
        Date: ${new Date(order.date).toLocaleString()}
        
        Customer Information:
        Name: ${order.customer.name}
        Phone: ${order.customer.phone}
        Address: ${order.customer.address}
        
        Items:
        ${itemsList}
        
        Subtotal: ${order.total - order.deliveryFee} BDT
        Delivery Fee: ${order.deliveryFee} (${order.deliveryArea})
        Total: ${order.total} BDT
        
        Status: ${order.status}
      `,
    };

    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Notification sent" });
      } else {
        console.warn("Email credentials not configured. Skipping email notification.");
        res.json({ success: true, message: "Email not configured, but order processed" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
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
