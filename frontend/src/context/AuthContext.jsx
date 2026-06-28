import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

const TOKEN_KEY = "food_token";
const USER_KEY = "food_user";

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
      if (!token) {
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
    return authApi.register(payload);
  };

  const resendVerification = async (payload) => {
    return authApi.resendVerification(payload);
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    saveSession(data);
    return data;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      register,
      resendVerification,
      login,
      logout,
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
