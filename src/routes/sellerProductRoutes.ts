import express from "express";
import {
  addProduct,
  showProduct,
  updateProduct,
} from "../controller/sellerProductController";
import { validateToken } from "../middleware/validateJwtHandler";
import { authorizeRole } from "../middleware/roleHandler";
import { getOrder, proccessOrder } from "../controller/sellerOrderController";

export const router = express.Router();
router.post("/", validateToken, authorizeRole("seller"), addProduct);
router.put("/:id", validateToken, authorizeRole("seller"), updateProduct);
router.get("/", validateToken, authorizeRole("seller"), showProduct);
router.get("/orders", validateToken, authorizeRole("seller"), getOrder);
router.post(
  "/orders/:orderId",
  validateToken,
  authorizeRole("seller"),
  proccessOrder
);
