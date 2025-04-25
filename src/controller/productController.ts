import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";
import { Product } from "../models/productModel";

export const searchProduct = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      product_name,
      category,
      page = "1",
      limit = "10",
      price,
      min_price,
      max_price,
    } = req.query;

    let filter: any = {};
    if (product_name) {
      filter.productName = { $regex: product_name, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    const minPrice = parseInt(min_price as string);
    if (!isNaN(minPrice)) {
      filter.price = { $gte: minPrice };
    }

    const maxPrice = parseInt(max_price as string);
    if (!isNaN(maxPrice)) {
      filter.price = { ...filter.price, $lte: maxPrice };
    }

    const defaultPageNumber: number = 1;
    const defaultLimitNumber: number = 10;
    const pageNumber: number = Math.max(
      parseInt(page as string) || defaultPageNumber,
      1
    );
    const limitNumber: number = Math.max(
      parseInt(limit as string) || defaultLimitNumber,
      1
    );
    const skipPage: number = (pageNumber - 1) * limitNumber;

    //sorting
    let sortPrice: any = {};
    if (price === "max") sortPrice.price = -1;
    if (price === "min") sortPrice.price = 1;

    const products = await Product.find(filter)
      .sort(sortPrice)
      .skip(skipPage)
      .limit(limitNumber);

    const totalProduct = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProduct / limitNumber);

    if (products.length === 0) {
      res.status(404);
      throw new Error("prduct not found");
    }

    res.status(200).json({
      status: "success",
      message: "Products retrieved",
      totalProduct,
      curentPage: pageNumber,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};
