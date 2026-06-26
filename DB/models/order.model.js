import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        name: {
          en: String,
          ar: String,
        },
        image: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String,
      default: "cash",
      enum: ["cash", "online"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid"],
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "preparing", "on_way", "delivered", "cancelled"],
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Order = model("Order", orderSchema);
