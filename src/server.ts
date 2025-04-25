import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { Router as userRouter } from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { connectDb } from "./config/dbConnection";
import { router as productRouter } from "./routes/sellerProductRoutes";
import { router as cartRouter } from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import productRouteUser from "./routes/productRoutes";
connectDb();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter);
app.use("/api/sellers/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRouteUser);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
