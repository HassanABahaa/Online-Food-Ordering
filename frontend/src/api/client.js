const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("food_token");

export const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.msg || "Request failed");
  }

  return data.data || data;
};

export const apiBaseUrl = API_BASE_URL;
