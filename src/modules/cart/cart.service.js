import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const moduleStatus = () => {
  return {
    module: "cart",
    status: "ready",
    endpoints: [
      "GET /cart",
      "POST /cart",
      "PATCH /cart/:productId",
      "DELETE /cart/:productId",
      "DELETE /cart",
    ],
  };
};

const emptyCart = () => {
  return {
    products: [],
    totalPrice: 0,
  };
};

const calculateCartTotal = (cart) => {
  cart.totalPrice = cart.products.reduce((total, item) => {
    item.totalPrice = item.itemPrice * item.quantity;
    return total + item.totalPrice;
  }, 0);
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, products: [], totalPrice: 0 });
  }

  return cart;
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return { cart: emptyCart() };
  }

  return { cart };
};

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  const product = await Product.findOne({ _id: productId, available: true });

  if (!product) {
    throw new Error("Product not found", { cause: 404 });
  }

  const cart = await getOrCreateCart(userId);
  const itemIndex = cart.products.findIndex(
    (item) => item.productId.toString() === product._id.toString(),
  );

  if (itemIndex > -1) {
    cart.products[itemIndex].quantity += Number(quantity);
    cart.products[itemIndex].itemPrice = product.price;
    cart.products[itemIndex].totalPrice = cart.products[itemIndex].quantity * product.price;
  } else {
    cart.products.push({
      productId: product._id,
      quantity,
      name: product.name,
      image: product.image,
      itemPrice: product.price,
      totalPrice: product.price * quantity,
    });
  }

  calculateCartTotal(cart);
  await cart.save();

  return { cart };
};

export const updateCart = async (userId, { productId, quantity }) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found", { cause: 404 });
  }

  const itemIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new Error("Product not found in cart", { cause: 404 });
  }

  cart.products[itemIndex].quantity = Number(quantity);
  cart.products[itemIndex].totalPrice = cart.products[itemIndex].itemPrice * Number(quantity);

  calculateCartTotal(cart);
  await cart.save();

  return { cart };
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found", { cause: 404 });
  }

  const products = cart.products.filter(
    (item) => item.productId.toString() !== productId,
  );

  if (products.length === cart.products.length) {
    throw new Error("Product not found in cart", { cause: 404 });
  }

  cart.products = products;
  calculateCartTotal(cart);
  await cart.save();

  return { cart };
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return { cart: emptyCart() };
  }

  cart.products = [];
  cart.totalPrice = 0;
  await cart.save();

  return { cart };
};