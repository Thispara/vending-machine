import { api } from "@/lib/axios";

const prefix = "/vending";
export const vendingService = {
  getProducts: async () => {
    const response = await api.get(`${prefix}/products`);
    return response.data;
  },
  buyProduct: async (
    id: string,
    inserted_money: { denomination: number; quantity: number }[]
  ) => {
    const response = await api.post(`${prefix}/buy/product`, {
      product_id: id,
      inserted_money: inserted_money,
    });
    return response.data;
  },
};
