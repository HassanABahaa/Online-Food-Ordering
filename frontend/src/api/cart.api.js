import { request } from "./client";

export const cartApi = {
  getCart: () => request("/cart"),

  addToCart: ({ productId, quantity }) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),

  updateCart: ({ productId, quantity }) =>
    request(`/cart/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  removeFromCart: (productId) =>
    request(`/cart/${productId}`, {
      method: "DELETE",
    }),

  clearCart: () =>
    request("/cart", {
      method: "DELETE",
    }),
};
