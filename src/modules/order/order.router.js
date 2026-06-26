import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as orderController from "./order.controller.js";
import * as orderSchema from "./order.schema.js";

const router = Router();

router.get("/status", asyncHandler(orderController.moduleStatus));

router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.createOrder),
  asyncHandler(orderController.createOrder),
);

router.get(
  "/my-orders",
  isAuthenticated,
  isAuthorized("user"),
  asyncHandler(orderController.getMyOrders),
);

router.get(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.orderId),
  asyncHandler(orderController.getOrderById),
);

router.patch(
  "/:id/cancel",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.orderId),
  asyncHandler(orderController.cancelOrder),
);

export default router;