import { request } from "./client";

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendVerification: (payload) =>
    request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request("/auth/me"),
};
