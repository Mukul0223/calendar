import axios from "axios";
import env from "../config/env.js";

const axiosClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default axiosClient;
