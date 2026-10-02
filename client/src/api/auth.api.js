import axiosClient from "../lib/axiosClient";

export const registerRequest = (name, email, password) =>
  axiosClient.post("/auth/register", { name, email, password });

export const loginRequest = (email, password) =>
  axiosClient.post("/auth/login", { email, password });

export const refreshRequest = () => axiosClient.post("/auth/refresh");

export const logoutRequest = () => axiosClient.post("/auth/logout");

export const meRequest = (accessToken) =>
  axiosClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
