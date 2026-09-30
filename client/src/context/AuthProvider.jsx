import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
} from "../api/auth.api.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await loginRequest(email, password);
      const { user, token } = res.data.data;
      setUser(user);
      setAccessToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      await registerRequest(name, email, password);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutRequest();
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = { user, accessToken, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
