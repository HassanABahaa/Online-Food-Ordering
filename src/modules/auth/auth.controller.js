import * as authService from "./auth.service.js";

export const moduleStatus = async (req, res) => {
  const data = authService.moduleStatus();

  return res.status(200).json({
    success: true,
    data,
  });
};

export const register = async (req, res) => {
  const data = await authService.register(req.body);

  return res.status(201).json({
    success: true,
    msg: "Activation link sent to your email",
    data,
  });
};

export const activateEmail = async (req, res) => {
  const data = await authService.activateEmail(req.query);

  return res.redirect(data.redirectUrl);
};

export const resendVerification = async (req, res) => {
  const data = await authService.resendVerification(req.body);

  return res.status(200).json({
    success: true,
    msg: data.alreadyVerified ? "Email is already activated" : "Activation link sent to your email",
    data,
  });
};

export const login = async (req, res) => {
  const data = await authService.login(req.body);

  return res.status(200).json({
    success: true,
    msg: "User logged in successfully",
    data,
  });
};

export const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};
