import { Request, Response } from "express";
import Cart from "../models/Cart";

// Add to Cart
const addToCart = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Add to cart route reached");
    console.log("User:", req.user);

    const { product, quantity } = req.body;

    const cart = await Cart.create({
      user: req.user!._id,
      product,
      quantity,
    });

    console.log("Cart Created:", cart);

    res.status(201).json({
      message: "Added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Get Cart
const getCart = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("GET CART ROUTE");

    const cart = await Cart.find({
      user: req.user!._id,
    }).populate("product");

    console.log("Cart Data:", cart);

    res.json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Update Quantity
const updateCart = async (
  req: Request,
  res: Response
) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Remove Item
const deleteCart = async (
  req: Request,
  res: Response
) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Cart item removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
};