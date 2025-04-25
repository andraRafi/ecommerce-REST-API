import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  items: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const cartSchema: Schema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },

  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});

export const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);
