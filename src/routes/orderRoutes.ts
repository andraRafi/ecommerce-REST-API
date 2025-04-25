import express from "express";
import { validateToken } from "../middleware/validateJwtHandler";
import { authorizeRole } from "../middleware/roleHandler";
import { orderProduct } from "../controller/orderController";

const router = express.Router();

router.post("/:productId", validateToken, authorizeRole("user"), orderProduct);

export default router;
