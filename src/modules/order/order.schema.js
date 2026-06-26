import Joi from "joi";

export const createOrder = Joi.object({
  address: Joi.string().min(3).max(200).required(),
  phone: Joi.string().min(7).max(20).required(),
  paymentMethod: Joi.string().valid("cash", "online").required(),
});

export const orderId = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
