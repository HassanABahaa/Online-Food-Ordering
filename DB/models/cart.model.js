import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
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
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Cart = model("Cart", cartSchema);
