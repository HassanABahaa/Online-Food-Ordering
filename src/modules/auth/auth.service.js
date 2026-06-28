import bcryptjs from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/models/user.model.js";
import { sendVerificationEmail } from "../../utils/email.service.js";

const OTP_TTL_MINUTES = 10;

export const moduleStatus = () => {
  return {
    module: "auth",
    status: "ready",
    endpoints: [
      "POST /auth/register",
      "POST /auth/verify-email",
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

const createOtp = () => String(crypto.randomInt(100000, 1000000));

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const attachVerificationOtp = async (user) => {
  const otp = createOtp();
  user.emailOtpHash = hashOtp(otp);
  user.emailOtpExpires = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await user.save();

  await sendVerificationEmail({
    to: user.email,
    userName: user.userName,
    otp,
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
    await attachVerificationOtp(emailExist);

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

  await attachVerificationOtp(user);

  return {
    email: user.email,
    requiresVerification: true,
  };
};

export const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error("Invalid email or verification code", { cause: 400 });
  }

  if (user.isVerified !== false) {
    const token = generateToken(user);
    return { token, user: formatUser(user) };
  }

  const otpExpired = !user.emailOtpExpires || user.emailOtpExpires.getTime() < Date.now();
  const otpMatches = user.emailOtpHash && user.emailOtpHash === hashOtp(otp);

  if (otpExpired || !otpMatches) {
    throw new Error("Invalid or expired verification code", { cause: 400 });
  }

  user.isVerified = true;
  user.emailVerifiedAt = new Date();
  user.emailOtpHash = undefined;
  user.emailOtpExpires = undefined;
  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: formatUser(user),
  };
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

  await attachVerificationOtp(user);

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
    throw new Error("Please verify your email before login", { cause: 403 });
  }

  const token = generateToken(user);

  return {
    token,
    user: formatUser(user),
  };
};
