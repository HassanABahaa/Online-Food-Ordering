import * as orderService from "./order.service.js";

export const moduleStatus = async (req, res) => {
  const data = orderService.moduleStatus();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const createOrder = async (req, res) => {
  const data = await orderService.createOrder(req.user._id, req.body);

  return res.status(201).json({
    success: true,
    msg: "Order created successfully",
    data,
  });
};

export const getMyOrders = async (req, res) => {
  const data = await orderService.getMyOrders(req.user._id);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getOrderById = async (req, res) => {
  const data = await orderService.getOrderById(req.user._id, req.params.id);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const cancelOrder = async (req, res) => {
  const data = await orderService.cancelOrder(req.user._id, req.params.id);

  return res.status(200).json({
    success: true,
    msg: "Order cancelled successfully",
    data,
  });
};