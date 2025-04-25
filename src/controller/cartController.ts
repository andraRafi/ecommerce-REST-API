import { Request, Response, NextFunction } from "express";
import { Cart } from "../models/cartModel";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";
import Joi from "joi";

export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id, quantity } = req.body;

    const cartSchema = Joi.object({
      product_id: Joi.string().required(),
      quantity: Joi.number().required().min(1),
    });

    const { error } = cartSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    let cart = await Cart.findOne({ user_id: req.user?._id });

    if (!cart) {
      cart = new Cart({
        user_id: req.user?._id,
        items: [{ product_id, quantity }],
      });

      await cart.save();
      res.status(200).json({
        status: "success",
        message: "Product added to cart",
        cart,
      });
      return;
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({ product_id, quantity });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user?._id }).populate(
      "items.product_id"
    );
    if (!cart) {
      res.status(200).json({
        message: "Your cart is empty",
        items: [],
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "successfuly",
      cart: cart!.items,
    });
  } catch (error) {
    next(error);
  }
};

export const removeProductCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      res.status(400);
      throw new Error("product id required");
    }

    const cart = await Cart.findOne({ user_id: req.user?._id });

    if (!cart) {
      res.status(404);
      throw new Error("cart not found");
    }

    cart!.items = cart!.items.filter(
      (item) => item.product_id.toString() !== product_id
    );
    await cart!.save();

    res.status(200).json({
      status: "success",
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCart = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOneAndDelete({ user_id: req.user?._id });

    if (!cart) {
      res.status(404);
      throw new Error("cart not found");
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
