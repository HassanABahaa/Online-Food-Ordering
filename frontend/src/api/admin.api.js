import { request } from "./client";

const toQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : "";
};

export const adminApi = {
  getStats: () => request("/admin/stats"),

  getProducts: (params) => request(`/admin/products${toQueryString(params)}`),

  createProduct: (payload) =>
    request("/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProduct: (id, payload) =>
    request(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteProduct: (id) =>
    request(`/admin/products/${id}`, {
      method: "DELETE",
    }),

  getOrders: (params) => request(`/admin/orders${toQueryString(params)}`),

  getOrderById: (id) => request(`/admin/orders/${id}`),

  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
