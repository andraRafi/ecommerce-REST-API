import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";
import Joi from "joi";
import { Product } from "../models/productModel";
import { Order } from "../models/orderModel";

export const getOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "10", status } = req.query;

    let filter: any = { seller_id: req.user?._id };

    if (status) {
      filter.status = status;
    }

    const defaultPageNumber: number = 1;
    const defaultLimitNumber: number = 10;

    const pageNumber: number = parseInt(page as string) || defaultPageNumber;
    const limitNumber: number = parseInt(limit as string) || defaultLimitNumber;
    const skip: number = (pageNumber - 1) * limitNumber;

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limitNumber);

    const viewOrders = await Order.find(filter)
      .skip(skip)
      .limit(limitNumber)

      .populate({
        path: "product_id",
        select: "productName price category",
      })
      .populate({
        path: "user_id",
        select: "username address",
      });

    if (viewOrders.length === 0) {
      res.status(404);
      throw new Error("order not found");
    }

    res.status(200).json({
      status: "success",
      message: "List of orders for seller",
      totalOrders,
      totalPages,
      curentPages: pageNumber,
      viewOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const proccessOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const findOrder = await Order.findById(orderId);
    if (!findOrder) {
      res.status(404);
      throw new Error("order not found");
    }

    if (findOrder.seller_id.toString() !== req.user?._id.toString()) {
      res.status(403);
      throw new Error("Unauthorized access");
    }

    if (findOrder.status !== "pending") {
      res.status(400);
      throw new Error("Order has already been processed");
    }

    findOrder.status = "proccess";
    await findOrder.save();

    res.status(200).json({
      status: "success",
      message: "order process by seller",
      order: findOrder,
    });
  } catch (error) {
    next(error);
  }
};
