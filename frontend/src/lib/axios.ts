// src/lib/axios.ts
"use client";

import axios from "axios";
import { authService } from "@/service/auth/auth.service";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        return api(originalRequest);
      } catch (err) {
        await authService.logout();
      }
    }

    return Promise.reject(error);
  }
);
