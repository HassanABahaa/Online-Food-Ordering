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

// Normalize env vars: trim stray whitespace/newlines that can be introduced
// when values are added through some deployment dashboards/CLIs.
for (const key of [
  "MONGO_URI",
  "JWT_SECRET",
  "SALT_ROUND",
  "BEARER_KEY",
  "CLIENT_URLS",
  "NODE_ENV",
  "PORT",
]) {
  if (typeof process.env[key] === "string") {
    process.env[key] = process.env[key].trim();
  }
}

const app = express();

const whiteList = (process.env.CLIENT_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const allowAllOrigins = whiteList.includes("*");

app.use((req, res, next) => {
  const origin = req.header("origin");

  if (!origin || allowAllOrigins || whiteList.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

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

export default app;
