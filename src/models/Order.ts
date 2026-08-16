import mongoose, { Document, Model, Types } from "mongoose";

interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderProduct[];
  totalPrice: number;
  address: string;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "Pending" | "Paid";
  stripeSessionId: string;
  status: string;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    stripeSessionId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  orderSchema
);

export default Order;