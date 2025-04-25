import express from "express";
import {
  addToCart,
  getCart,
  removeCart,
  removeProductCart,
} from "../controller/cartController";
import { validateToken } from "../middleware/validateJwtHandler";
import { authorizeRole } from "../middleware/roleHandler";

export const router = express.Router();
router.post("/", validateToken, authorizeRole("user"), addToCart);
router.get("/", validateToken, authorizeRole("user"), getCart);
router.delete(
  "/:product_id",
  validateToken,
  authorizeRole("user"),
  removeProductCart
);
router.delete("/", validateToken, authorizeRole("user"), removeCart);
