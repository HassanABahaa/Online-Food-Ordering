import { request } from "./client";

export const orderApi = {
  createOrder: (payload) =>
    request("/order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyOrders: () => request("/order/my-orders"),

  getOrderById: (id) => request(`/order/${id}`),

  cancelOrder: (id) =>
    request(`/order/${id}/cancel`, {
      method: "PATCH",
    }),
};
