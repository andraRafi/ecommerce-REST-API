import express from "express";
import { validateToken } from "../middleware/validateJwtHandler";
import { searchProduct } from "../controller/productController";
import { authorizeRole } from "../middleware/roleHandler";

const router = express.Router();

router.get("/search", validateToken, authorizeRole("user"), searchProduct);
export default router;
