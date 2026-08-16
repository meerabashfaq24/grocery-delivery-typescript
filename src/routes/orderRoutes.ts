import express from "express";
import protect from "../middleware/authMiddleware";

import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  placeOrderStripe,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);
router.post("/stripe", protect, placeOrderStripe);

export default router;