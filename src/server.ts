
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import cors from "cors";

import productRoutes from "./routes/productRoutes";
import protect from "./middleware/authMiddleware";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import { stripeWebhook } from "./controllers/orderController";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

// Stripe webhook must receive the raw request body
app.post(
  "/api/orders/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.send("Grocery Delivery API is running...");
});

// Protected Profile Route
app.get(
  "/api/profile",
  protect,
  (req, res) => {
    const user = (req as Request & {
      user?: {
        _id: string;
        name: string;
        email: string;
        role?: "user" | "admin";
      };
    }).user;

    res.json(user);
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});