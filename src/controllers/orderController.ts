import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import Cart from "../models/Cart";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Create Order - COD
const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const { products, totalPrice, address } = req.body;

    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice: Number(Number(totalPrice).toFixed(2)),
      address,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Confirmed",
    });

    // Clear user's cart after successful COD order
    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Server error",
    });
  }
};

// Get All Orders
const getOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .populate("products.product");

    res.json(orders);
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Server error",
    });
  }
};

// Update Order
const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.json(order);
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Server error",
    });
  }
};

// Delete Order
const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
      return;
    }

    res.json({
      message: "Order deleted",
    });
  } catch (error: unknown) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Server error",
    });
  }
};

// Place Order with Stripe
const placeOrderStripe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }

    console.log("Stripe route reached");

    const { products, address } = req.body;

    console.log("Products received:", products);

    let totalPrice = 0;

    // Calculate total price from database
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      totalPrice += product.price * item.quantity;
    }

    totalPrice = Number(totalPrice.toFixed(2));

    // Create pending order
    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      address,
      paymentMethod: "Stripe",
      paymentStatus: "Pending",
      status: "Pending",
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Create Stripe line items
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
        return;
      }

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },

      payment_intent_data: {
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
      },

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // Save Stripe session ID
    order.stripeSessionId = session.id;

    await order.save();

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error: unknown) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Server error",
    });
  }
};

// Stripe Webhook
const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    res.status(400).send("Missing Stripe signature");
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Webhook error";

    console.log("Webhook Signature Error:", message);

    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  console.log("Webhook Event:", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("✅ Checkout completed");

    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Session Metadata:", session.metadata);

    const orderId = session.metadata?.orderId;
    const userId = session.metadata?.userId;

    if (!orderId || !userId) {
      res.status(400).json({
        message: "Missing order or user metadata",
      });
      return;
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      status: "Confirmed",
    });

    console.log("✅ Order updated");

    await Cart.deleteMany({
      user: userId,
    });

    console.log("🛒 Cart cleared");
  }

  res.json({
    received: true,
  });
};

export {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  placeOrderStripe,
  stripeWebhook,
};