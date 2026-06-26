import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const bearerKey = process.env.BEARER_KEY || "Bearer";

    if (!authorization?.startsWith(`${bearerKey} `)) {
      return next(new Error("Token is required", { cause: 401 }));
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next(new Error("Invalid token format", { cause: 401 }));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    if (!user.isActive) {
      return next(new Error("Account is disabled", { cause: 403 }));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(new Error("Invalid token", { cause: 401 }));
  }
};