import Joi from "joi";

const languageValue = Joi.object({
  en: Joi.string().min(2).max(250).required(),
  ar: Joi.string().min(2).max(250).required(),
});

export const listProducts = Joi.object({
  category: Joi.string().valid(
    "pizza",
    "burger",
    "chicken",
    "pasta",
    "drinks",
    "dessert",
  ),
  keyword: Joi.string().min(1).max(50),
  available: Joi.boolean(),
  page: Joi.number().integer().min(1),
});

export const createProduct = Joi.object({
  name: languageValue.required(),
  description: languageValue.required(),
  image: Joi.string().uri().required(),
  price: Joi.number().min(1).required(),
  category: Joi.string()
    .valid("pizza", "burger", "chicken", "pasta", "drinks", "dessert")
    .required(),
  available: Joi.boolean(),
});

export const updateProduct = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: languageValue,
  description: languageValue,
  image: Joi.string().uri(),
  price: Joi.number().min(1),
  category: Joi.string().valid(
    "pizza",
    "burger",
    "chicken",
    "pasta",
    "drinks",
    "dessert",
  ),
  available: Joi.boolean(),
});

export const productId = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listOrders = Joi.object({
  status: Joi.string().valid("placed", "preparing", "on_way", "delivered", "cancelled"),
  paymentMethod: Joi.string().valid("cash", "online"),
  page: Joi.number().integer().min(1),
});

export const orderId = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const updateOrderStatus = Joi.object({
  id: Joi.string().hex().length(24).required(),
  status: Joi.string()
    .valid("placed", "preparing", "on_way", "delivered", "cancelled")
    .required(),
});