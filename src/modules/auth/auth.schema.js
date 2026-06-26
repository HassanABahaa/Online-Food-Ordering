import Joi from "joi";

export const register = Joi.object({
  userName: Joi.string().min(3).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  phone: Joi.string().min(7).max(20),
  address: Joi.string().min(3).max(200),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
