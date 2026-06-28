import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema(
  {
    userName: { type: String, required: true, min: 3, max: 25 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
    emailOtpHash: { type: String },
    emailOtpExpires: { type: Date },
    emailVerifiedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    const saltRound = parseInt(process.env.SALT_ROUND) || 8;
    this.password = bcryptjs.hashSync(this.password, saltRound);
  }
});

export const User = model("User", userSchema);
