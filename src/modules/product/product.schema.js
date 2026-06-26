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