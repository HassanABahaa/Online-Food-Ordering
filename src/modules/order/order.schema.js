import Joi from "joi";

const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export const createOrder = Joi.object({
  address: Joi.string().min(3).max(200).required(),
  phone: Joi.string().pattern(egyptPhoneRegex).required().messages({
    "string.pattern.base": "Phone must be an Egyptian number that starts with 010, 011, 012 or 015",
  }),
  paymentMethod: Joi.string().valid("cash", "online").required(),
});

export const orderId = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
