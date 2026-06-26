import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as productController from "./product.controller.js";
import * as productSchema from "./product.schema.js";

const router = Router();

router.get("/status", asyncHandler(productController.moduleStatus));

router.get(
  "/",
  validation(productSchema.listProducts),
  asyncHandler(productController.getProducts),
);

router.get(
  "/:id",
  validation(productSchema.productId),
  asyncHandler(productController.getProductById),
);

export default router;