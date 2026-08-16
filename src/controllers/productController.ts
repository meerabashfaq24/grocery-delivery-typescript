import { Request, Response } from "express";
import Product from "../models/Product";
import { ApiResponse } from "../types";

// Create Product
const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    const response: ApiResponse<typeof product> = {
      success: true,
      data: product,
      message: "Product created successfully",
    };

    res.status(201).json(response);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Get All Products
const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("category");

    res.status(200).json(products);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Get Single Product
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Update Product
const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

// Delete Product
const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};