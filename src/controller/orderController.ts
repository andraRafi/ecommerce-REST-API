import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";
import { Product } from "../models/productModel";
import Joi from "joi";
import { Order } from "../models/orderModel";
import { Cart } from "../models/cartModel";

export const orderProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const orderSchema = Joi.object({
      quantity: Joi.number().required().min(1),
      voucher: Joi.string().optional(),
    });

    const { error } = orderSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("product not found");
    }

    if (quantity > product.stock) {
      res.status(400);
      throw new Error("stock not available");
    }

    const checkoutPrice: number = product.price * quantity;

    const order = new Order({
      user_id: req.user?._id,
      seller_id: product.seller_id,
      product_id: product.id,
      quantity,
      total_price: checkoutPrice,
    });

    await order.save();

    product.stock -= quantity;
    await product.save();

    res.status(200).json({
      status: "success",
      message: "success to order",
      order,
    });
  } catch (error) {
    next(error);
  }
};
