import mongoose, { Model } from "mongoose";
import { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  product_id: mongoose.Schema.Types.ObjectId;
  seller_id: mongoose.Schema.Types.ObjectId;
  quantity: number;
  total_price: number;
  status: string;
}

const orderSchema: Schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Menyimpan seller langsung
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "proccess", "shipping", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  orderSchema
);
