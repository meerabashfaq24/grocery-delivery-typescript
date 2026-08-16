import mongoose, { Document, Model, Types } from "mongoose";

export interface ICart extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;