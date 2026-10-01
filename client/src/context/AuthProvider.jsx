import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from "../api/auth.api.js";
import axiosClient, {
  setAccessToken as setAxiosAccessToken,
} from "@/lib/axiosClient.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const updateTokens = (token) => {
    setAccessTokenState(token);
    setAxiosAccessToken(token);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await axiosClient.post("/auth/refresh");
        const { token, user } = res.data.data;

        updateTokens(token);
        if (user) setUser(user);
      } catch {
        updateTokens(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await loginRequest(email, password);
      const { user, token } = res.data.data;

      setUser(user);
      updateTokens(token);
      navigate("/dashboard");
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await registerRequest(name, email, password);
      navigate("/login");
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Failed to revoke refresh token on backend:", error);
    } finally {
      setUser(null);
      updateTokens(null);
      setIsLoading(false);
      navigate("/");
    }
  };

  const value = { user, accessToken, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
