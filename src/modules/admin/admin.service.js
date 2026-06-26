import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { User } from "../../../DB/models/user.model.js";

export const moduleStatus = () => {
  return {
    module: "admin",
    status: "ready",
    endpoints: [
      "GET /admin/stats",
      "GET /admin/products",
      "POST /admin/products",
      "GET /admin/products/:id",
      "PATCH /admin/products/:id",
      "DELETE /admin/products/:id",
      "GET /admin/orders",
      "GET /admin/orders/:id",
      "PATCH /admin/orders/:id/status",
    ],
  };
};

const toPageNumber = (page) => {
  return page < 1 || isNaN(page) ? 1 : Number(page);
};

const toBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

const buildProductFilter = ({ category, keyword, available } = {}) => {
  const filter = {};
  const availableValue = toBoolean(available);

  if (category) {
    filter.category = category;
  }

  if (availableValue !== undefined) {
    filter.available = availableValue;
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

const buildOrderFilter = ({ status, paymentMethod } = {}) => {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  return filter;
};

export const getStats = async () => {
  const revenueResult = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
  ]);

  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    productsCount,
    usersCount,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ["placed", "preparing", "on_way"] } }),
    Order.countDocuments({ status: "delivered" }),
    Order.countDocuments({ status: "cancelled" }),
    Product.countDocuments(),
    User.countDocuments({ role: "user" }),
  ]);

  return {
    stats: {
      totalOrders,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      productsCount,
      usersCount,
    },
  };
};

export const getProducts = async ({ category, keyword, available, page = 1 } = {}) => {
  const filter = buildProductFilter({ category, keyword, available });
  const currentPage = toPageNumber(page);
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

export const createProduct = async (adminId, payload) => {
  const product = await Product.create({
    ...payload,
    createdBy: adminId,
  });

  return { product };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  return { product };
};

export const updateProduct = async (id, payload) => {
  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  return { product };
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  return { product };
};

export const getOrders = async ({ status, paymentMethod, page = 1 } = {}) => {
  const filter = buildOrderFilter({ status, paymentMethod });
  const currentPage = toPageNumber(page);
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter)
      .populate("user", "userName email phone address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit) || 1,
    },
  };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id).populate(
    "user",
    "userName email phone address",
  );

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }

  return { order };
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }

  if (order.status === "cancelled") {
    throw new Error("Cancelled order cannot be updated", { cause: 400 });
  }

  order.status = status;

  if (status === "delivered") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return { order };
};