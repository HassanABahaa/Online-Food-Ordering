import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as adminController from "./admin.controller.js";
import * as adminSchema from "./admin.schema.js";

const router = Router();

router.get("/status", asyncHandler(adminController.moduleStatus));

router.use(isAuthenticated, isAuthorized("admin"));

router.get("/stats", asyncHandler(adminController.getStats));

router.get(
  "/products",
  validation(adminSchema.listProducts),
  asyncHandler(adminController.getProducts),
);

router.post(
  "/products",
  validation(adminSchema.createProduct),
  asyncHandler(adminController.createProduct),
);

router.get(
  "/products/:id",
  validation(adminSchema.productId),
  asyncHandler(adminController.getProductById),
);

router.patch(
  "/products/:id",
  validation(adminSchema.updateProduct),
  asyncHandler(adminController.updateProduct),
);

router.delete(
  "/products/:id",
  validation(adminSchema.productId),
  asyncHandler(adminController.deleteProduct),
);

router.get(
  "/orders",
  validation(adminSchema.listOrders),
  asyncHandler(adminController.getOrders),
);

router.get(
  "/orders/:id",
  validation(adminSchema.orderId),
  asyncHandler(adminController.getOrderById),
);

router.patch(
  "/orders/:id/status",
  validation(adminSchema.updateOrderStatus),
  asyncHandler(adminController.updateOrderStatus),
);

export default router;