import { Request, Response } from "express";
import Category from "../models/Category";

// Create
const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

// Read All
const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

// Update
const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(category);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

// Delete
const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted",
    });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

export {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};