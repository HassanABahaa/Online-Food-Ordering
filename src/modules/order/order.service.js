import { Cart } from "../../../DB/models/cart.model.js";
import { Order } from "../../../DB/models/order.model.js";

export const moduleStatus = () => {
  return {
    module: "order",
    status: "ready",
    endpoints: [
      "POST /order",
      "GET /order/my-orders",
      "GET /order/:id",
      "PATCH /order/:id/cancel",
    ],
  };
};

const formatOrderProducts = (products) => {
  return products.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    name: item.name,
    image: item.image,
    itemPrice: item.itemPrice,
    totalPrice: item.totalPrice,
  }));
};

const getCartTotal = (cart) => {
  return cart.products.reduce((total, item) => total + item.totalPrice, 0);
};

export const createOrder = async (userId, { address, phone, paymentMethod }) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.products.length === 0) {
    throw new Error("Cart is empty", { cause: 400 });
  }

  const totalPrice = getCartTotal(cart);

  const order = await Order.create({
    user: userId,
    products: formatOrderProducts(cart.products),
    address,
    phone,
    paymentMethod,
    paymentStatus: paymentMethod === "online" ? "paid" : "pending",
    status: "placed",
    totalPrice,
  });

  cart.products = [];
  cart.totalPrice = 0;
  await cart.save();

  return { order };
};

export const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  return { orders };
};

export const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }

  return { order };
};

export const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new Error("Order not found", { cause: 404 });
  }

  if (!["placed", "preparing"].includes(order.status)) {
    throw new Error("Order cannot be cancelled now", { cause: 400 });
  }

  order.status = "cancelled";
  await order.save();

  return { order };
};