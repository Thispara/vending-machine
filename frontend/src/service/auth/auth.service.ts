// src/service/auth/auth.service.ts

import axios from "axios";
import { tokenStorage } from "./token.storage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ใช้ cookie refresh token
});

const prefix = "/auth";

export const authService = {
  async login(username: string, password: string) {
    const res = await refreshApi.post(`${prefix}/login`, {
      username,
      password,
    });

    tokenStorage.set(res.data.access_token);
    return res.data;
  },

  async register(username: string, password: string) {
    const res = await refreshApi.post(`${prefix}/register`, {
      username,
      password,
    });
    return res.data;
  },

  async refreshToken() {
    const res = await refreshApi.post(`${prefix}/refresh`);

    tokenStorage.set(res.data.access_token);
    return res.data;
  },

  async logout() {
    await refreshApi.post(`${prefix}/logout`);
    tokenStorage.clear();
  },

  getAccessToken() {
    return tokenStorage.get();
  },
};
