import mongoose, { Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema
);

export default Category;