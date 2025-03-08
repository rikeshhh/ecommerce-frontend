"use client";

import { create } from "zustand";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductState {
  products: Product[];
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],

  fetchProducts: async () => {
    const token = localStorage.getItem("authToken");
    console.log("Fetching products with token:", token);
    if (!token) {
      set({ products: [] });
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Products received:", response.data);
      set({ products: response.data });
    } catch (error) {
      console.error(
        "Error fetching products:",
        axios.isAxiosError(error) ? error.response?.data || error.message : error
      );
      set({ products: [] });
    }
  },
}));
