import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import adminRouter from "./src/modules/admin/admin.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const whiteList = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.header("origin");

  if (!origin || whiteList.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    return next();
  }

  return next(new Error("Blocked by CORS!", { cause: 403 }));
});

app.use(morgan("dev"));
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Online Food Ordering API is running",
  });
});

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res, next) => {
  return next(new Error("Page not found!", { cause: 404 }));
});

app.use((error, req, res, next) => {
  const statusCode = error.cause || 500;
  return res.status(statusCode).json({
    success: false,
    msg: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

app.listen(port, () => console.log("App is listening at port:", port));
