import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as cartController from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";

const router = Router();

router.get("/status", asyncHandler(cartController.moduleStatus));

router.get(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  asyncHandler(cartController.getCart),
);

router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.addToCart),
  asyncHandler(cartController.addToCart),
);

router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.updateCart),
  asyncHandler(cartController.updateCart),
);

router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.removeFromCart),
  asyncHandler(cartController.removeFromCart),
);

router.delete(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  asyncHandler(cartController.clearCart),
);

export default router;