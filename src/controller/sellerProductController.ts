// role : seller
import { NextFunction, Request, Response } from "express";
import { IProduct, Product } from "../models/productModel";
import Joi from "joi";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";

//add product
export const addProduct = async (
  req: AuthenticatedRequest & { body: IProduct },
  res: Response,
  next: NextFunction
) => {
  try {
    const { productName, price, category, stock, description } = req.body;

    const addProductSchema = Joi.object({
      productName: Joi.string().required().min(3).max(30),
      price: Joi.number().required(),
      category: Joi.string().required(),
      stock: Joi.number().required(),
      description: Joi.string().required(),
    });

    const { error } = addProductSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const newProduct = await Product.create({
      seller_id: req.user?._id,
      productName,
      price,
      category,
      stock,
      description,
    });

    res.status(201).json({
      status: "success",
      message: "product successfuly uploaded",
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// showproduct
export const showProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.find({ seller_id: req.user?._id });
    if (product.length === 0) {
      res.status(404);
      throw new Error("no product found");
    }

    res.status(200).json({
      status: "success",
      message: "list product",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// update product
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productName, price, stock, description, category } = req.body;

    const addProductSchema = Joi.object({
      productName: Joi.string().min(3).max(30),
      price: Joi.number(),
      category: Joi.string(),
      stock: Joi.number(),
      description: Joi.string(),
    });

    const { error } = addProductSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, seller_id: req.user?._id },
      { productName, price, stock, description, category },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404);
      throw new Error("product not found");
    }

    res.status(201).json({
      status: "success",
      message: "pruduct updated",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller_id: req.user?._id,
    });

    if (!product) {
      res.status(404);
      throw new Error("product not found");
    }
    res.status(201).json({
      status: "success",
      message: "product deleted successfuly",
      product,
    });
  } catch (error) {
    next(error);
  }
};
