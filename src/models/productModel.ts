import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  seller_id: mongoose.Schema.Types.ObjectId;
  productName: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    productName: {
      type: String,
      required: [true],
    },

    price: {
      type: Number,
      required: [true],
    },

    category: {
      type: String,
      required: [true],
    },

    stock: {
      type: Number,
      required: [true],
    },

    description: {
      type: String,
      required: [true],
    },
  },
  {
    timestamps: true, //
    minimize: false,
  }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  userSchema
);
