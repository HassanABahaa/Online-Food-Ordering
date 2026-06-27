import Joi from "joi";

const userNameRegex = /^[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9 _-]{2,24}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;
const egyptPhoneRegex = /^01[0125][0-9]{8}$/;

export const register = Joi.object({
  userName: Joi.string().pattern(userNameRegex).required().messages({
    "string.pattern.base": "User name must be 3-25 characters and contain only letters, numbers, spaces, _ or -",
  }),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base": "Password must be 8-30 characters and include uppercase, lowercase and number",
  }),
  phone: Joi.string().empty("").pattern(egyptPhoneRegex).messages({
    "string.pattern.base": "Phone must be an Egyptian number that starts with 010, 011, 012 or 015",
  }),
  address: Joi.string().empty("").min(3).max(200),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
