import express from "express";
import protect from "../middleware/authMiddleware";

import {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
} from "../controllers/cartController";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCart);
router.delete("/:id", protect, deleteCart);

export default router;