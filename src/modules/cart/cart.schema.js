import Joi from "joi";

export const addToCart = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateCart = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const removeFromCart = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
