import { authStore } from "@/store/auth.store";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      authStore.logout();
    }
    return Promise.reject(err);
  }
);
