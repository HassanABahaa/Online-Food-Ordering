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

export const productApi = {
  getProducts: (params) => request(`/product${toQueryString(params)}`),
  getProductById: (id) => request(`/product/${id}`),
};
