import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  address: string;
  email: string;
  password: string;
  role: string;
}

const userSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please add username"],
    },

    address: {
      type: String,
      required: [true, "please add address"],
    },

    email: {
      type: String,
      required: [true, "please add email"],
      unique: [true, "email already taken"],
    },

    password: {
      type: String,
      required: [true, "please add password"],
    },

    role: {
      type: String,
      required: [true, "please add role"],
      enum: ["seller", "user"],
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
