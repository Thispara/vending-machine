import { api } from "@/lib/axios";
import { MoneyItem } from "@/types/type";

const prefix = "/admin";

export const adminService = {
  getProducts: async () => {
    const response = await api.get(`${prefix}/products`);
    return response.data;
  },
  addProduct: async (formData: FormData) => {
    const response = await api.post(`${prefix}/products`, formData);
    return response.data;
  },
  updateProduct: async (id: string, formData: FormData) => {
    const response = await api.put(`${prefix}/products/${id}`, formData);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`${prefix}/products/${id}`);
    return response.data;
  },
  getBalance: async (): Promise<MoneyItem[]> => {
    const response = await api.get(`${prefix}/balance`);
    return response.data;
  },
  setBalance: async (balance: MoneyItem[]): Promise<MoneyItem[]> => {
    const response = await api.put(`${prefix}/balance`, balance);
    return response.data;
  },
  getSellHistory: async () => {
    const response = await api.get(`${prefix}/sell-history`);
    return response.data;
  },
};
