import * as adminService from "./admin.service.js";

export const moduleStatus = async (req, res) => {
  const data = adminService.moduleStatus();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getStats = async (req, res) => {
  const data = await adminService.getStats();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getProducts = async (req, res) => {
  const data = await adminService.getProducts(req.query);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const createProduct = async (req, res) => {
  const data = await adminService.createProduct(req.user._id, req.body);

  return res.status(201).json({
    success: true,
    msg: "Product created successfully",
    data,
  });
};

export const getProductById = async (req, res) => {
  const data = await adminService.getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const updateProduct = async (req, res) => {
  const data = await adminService.updateProduct(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    msg: "Product updated successfully",
    data,
  });
};

export const deleteProduct = async (req, res) => {
  const data = await adminService.deleteProduct(req.params.id);

  return res.status(200).json({
    success: true,
    msg: "Product deleted successfully",
    data,
  });
};

export const getOrders = async (req, res) => {
  const data = await adminService.getOrders(req.query);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getOrderById = async (req, res) => {
  const data = await adminService.getOrderById(req.params.id);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const updateOrderStatus = async (req, res) => {
  const data = await adminService.updateOrderStatus(req.params.id, req.body.status);

  return res.status(200).json({
    success: true,
    msg: "Order status updated successfully",
    data,
  });
};