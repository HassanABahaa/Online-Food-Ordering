import * as productService from "./product.service.js";

export const moduleStatus = async (req, res) => {
  const data = productService.moduleStatus();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getProducts = async (req, res) => {
  const data = await productService.getProducts(req.query);

  return res.status(200).json({
    success: true,
    data,
  });
};

export const getProductById = async (req, res) => {
  const data = await productService.getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    data,
  });
};