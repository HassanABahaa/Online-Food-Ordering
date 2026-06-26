import { Product } from "../../../DB/models/product.model.js";

export const moduleStatus = () => {
  return {
    module: "product",
    status: "ready",
    endpoints: ["GET /product", "GET /product/:id"],
  };
};

const buildProductFilter = ({ category, keyword } = {}) => {
  const filter = { available: true };

  if (category) {
    filter.category = category;
  }

  if (keyword) {
    filter.$or = [
      { "name.en": { $regex: keyword, $options: "i" } },
      { "name.ar": { $regex: keyword, $options: "i" } },
      { "description.en": { $regex: keyword, $options: "i" } },
      { "description.ar": { $regex: keyword, $options: "i" } },
    ];
  }

  return filter;
};

export const getProducts = async ({ category, keyword, page = 1 } = {}) => {
  const filter = buildProductFilter({ category, keyword });
  const currentPage = page < 1 || isNaN(page) ? 1 : Number(page);
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit) || 1,
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, available: true });

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  return { product };
};