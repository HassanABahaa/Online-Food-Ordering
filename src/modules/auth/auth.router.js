import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";

const router = Router();

router.get("/status", asyncHandler(authController.moduleStatus));

router.post(
  "/register",
  validation(authSchema.register),
  asyncHandler(authController.register),
);

router.get(
  "/activate-email",
  validation(authSchema.activateEmail),
  asyncHandler(authController.activateEmail),
);

router.post(
  "/resend-verification",
  validation(authSchema.resendVerification),
  asyncHandler(authController.resendVerification),
);

router.post(
  "/login",
  validation(authSchema.login),
  asyncHandler(authController.login),
);

router.get("/me", isAuthenticated, asyncHandler(authController.me));

export default router;
