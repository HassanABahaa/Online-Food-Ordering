import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      en: { type: String, required: true, min: 2, max: 50 },
      ar: { type: String, required: true, min: 2, max: 50 },
    },
    description: {
      en: { type: String, required: true, min: 5, max: 250 },
      ar: { type: String, required: true, min: 5, max: 250 },
    },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      required: true,
      enum: ["pizza", "burger", "chicken", "pasta", "drinks", "dessert"],
    },
    available: { type: Boolean, default: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;

  const limit = 12;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};

productSchema.query.filterByCategory = function (category) {
  if (category) {
    return this.find({ category });
  }

  return this;
};

export const Product = model("Product", productSchema);
