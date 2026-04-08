import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
