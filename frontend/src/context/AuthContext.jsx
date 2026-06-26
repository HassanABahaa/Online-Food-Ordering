import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

const TOKEN_KEY = "food_token";
const USER_KEY = "food_user";

const isNetworkError = (error) => {
  return error.message === "Failed to fetch" || error.message.includes("Network");
};

const createDemoAuth = (payload, role = "user") => {
  const user = {
    _id: role === "admin" ? "demo-admin" : "demo-user",
    userName: payload.userName || payload.email?.split("@")[0] || "Demo User",
    email: payload.email,
    phone: payload.phone || "",
    address: payload.address || "",
    role,
    isActive: true,
  };

  return {
    token: `demo-${role}-token`,
    user,
  };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token || token.startsWith("demo-")) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.me();
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const register = async (payload) => {
    try {
      const data = await authApi.register(payload);
      saveSession(data);
      return data;
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const data = createDemoAuth(payload);
      saveSession(data);
      return data;
    }
  };

  const login = async (payload) => {
    try {
      const data = await authApi.login(payload);
      saveSession(data);
      return data;
    } catch (error) {
      if (!isNetworkError(error)) throw error;

      const role =
        payload.email === "admin@foodapp.com" && payload.password === "Admin123456"
          ? "admin"
          : "user";
      const data = createDemoAuth(payload, role);
      saveSession(data);
      return data;
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      register,
      login,
      logout,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
