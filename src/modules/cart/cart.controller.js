import * as cartService from "./cart.service.js";

export const moduleStatus = async (req, res) => {
  const data = cartService.moduleStatus();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getCart = async (req, res) => {
  const data = await cartService.getCart(req.user._id);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const addToCart = async (req, res) => {
  const data = await cartService.addToCart(req.user._id, req.body);

  return res.status(200).json({
    success: true,
    msg: "Product added to cart successfully",
    data,
  });
};

export const updateCart = async (req, res) => {
  const data = await cartService.updateCart(req.user._id, {
    productId: req.params.productId,
    quantity: req.body.quantity,
  });

  return res.status(200).json({
    success: true,
    msg: "Cart updated successfully",
    data,
  });
};

export const removeFromCart = async (req, res) => {
  const data = await cartService.removeFromCart(req.user._id, req.params.productId);

  return res.status(200).json({
    success: true,
    msg: "Product removed from cart successfully",
    data,
  });
};

export const clearCart = async (req, res) => {
  const data = await cartService.clearCart(req.user._id);

  return res.status(200).json({
    success: true,
    msg: "Cart cleared successfully",
    data,
  });
};