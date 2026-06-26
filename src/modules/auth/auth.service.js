import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/models/user.model.js";

export const moduleStatus = () => {
  return {
    module: "auth",
    status: "ready",
    endpoints: ["POST /auth/register", "POST /auth/login", "GET /auth/me"],
  };
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const formatUser = (user) => {
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

export const register = async (payload) => {
  const emailExist = await User.findOne({ email: payload.email });

  if (emailExist) {
    throw new Error("Email already exists", { cause: 409 });
  }

  const user = await User.create(payload);
  const token = generateToken(user);

  return {
    token,
    user: formatUser(user),
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password", { cause: 401 });
  }

  const isMatch = bcryptjs.compareSync(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password", { cause: 401 });
  }

  if (!user.isActive) {
    throw new Error("Account is disabled", { cause: 403 });
  }

  const token = generateToken(user);

  return {
    token,
    user: formatUser(user),
  };
};