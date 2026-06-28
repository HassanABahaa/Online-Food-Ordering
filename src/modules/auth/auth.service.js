import bcryptjs from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/models/user.model.js";
import { sendActivationEmail } from "../../utils/email.service.js";

const ACTIVATION_TTL_MINUTES = 30;

export const moduleStatus = () => {
  return {
    module: "auth",
    status: "ready",
    endpoints: [
      "POST /auth/register",
      "GET /auth/activate-email",
      "POST /auth/resend-verification",
      "POST /auth/login",
      "GET /auth/me",
    ],
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
    isVerified: user.isVerified !== false,
    createdAt: user.createdAt,
  };
};

const createActivationToken = () => crypto.randomBytes(32).toString("hex");

const hashActivationToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const getApiUrl = () => (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

const getFrontendUrl = () => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/$/, "");

  const firstClientUrl = (process.env.CLIENT_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .find((url) => url && url !== "*");

  return (firstClientUrl || "http://localhost:5173").replace(/\/$/, "");
};

const buildLoginRedirect = (status) => {
  const url = new URL("/login", getFrontendUrl());
  url.searchParams.set("verified", status);
  return url.toString();
};

const attachActivationLink = async (user) => {
  const rawToken = createActivationToken();
  user.emailVerificationTokenHash = hashActivationToken(rawToken);
  user.emailVerificationTokenExpires = new Date(Date.now() + ACTIVATION_TTL_MINUTES * 60 * 1000);
  await user.save();

  const activationUrl = new URL("/auth/activate-email", getApiUrl());
  activationUrl.searchParams.set("email", user.email);
  activationUrl.searchParams.set("token", rawToken);

  await sendActivationEmail({
    to: user.email,
    userName: user.userName,
    activationLink: activationUrl.toString(),
  });
};

export const register = async (payload) => {
  const email = payload.email.toLowerCase();
  const emailExist = await User.findOne({ email });

  if (emailExist?.isVerified === false) {
    emailExist.userName = payload.userName;
    emailExist.password = payload.password;
    emailExist.phone = payload.phone;
    emailExist.address = payload.address;
    await attachActivationLink(emailExist);

    return {
      email: emailExist.email,
      requiresVerification: true,
    };
  }

  if (emailExist) {
    throw new Error("Email already exists", { cause: 409 });
  }

  const user = await User.create({
    ...payload,
    email,
    isVerified: false,
  });

  await attachActivationLink(user);

  return {
    email: user.email,
    requiresVerification: true,
  };
};

export const activateEmail = async ({ email, token }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error("Invalid or expired activation link", { cause: 400 });
  }

  if (user.isVerified !== false) {
    return { alreadyVerified: true, redirectUrl: buildLoginRedirect("already") };
  }

  const tokenExpired =
    !user.emailVerificationTokenExpires || user.emailVerificationTokenExpires.getTime() < Date.now();
  const tokenMatches =
    user.emailVerificationTokenHash && user.emailVerificationTokenHash === hashActivationToken(token);

  if (tokenExpired || !tokenMatches) {
    throw new Error("Invalid or expired activation link", { cause: 400 });
  }

  user.isVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  return { redirectUrl: buildLoginRedirect("success") };
};

export const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error("Email not found", { cause: 404 });
  }

  if (user.isVerified !== false) {
    return {
      email: user.email,
      alreadyVerified: true,
    };
  }

  await attachActivationLink(user);

  return {
    email: user.email,
    requiresVerification: true,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

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

  if (user.isVerified === false) {
    throw new Error("Please activate your account from the email link before login", { cause: 403 });
  }

  const token = generateToken(user);

  return {
    token,
    user: formatUser(user),
  };
};
