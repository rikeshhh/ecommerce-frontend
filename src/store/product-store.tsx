"use client";

import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],

  fetchProducts: async () => {
    const token = localStorage.getItem("authToken");
    console.log("Fetching products with token:", token);
    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in to view products.",
      });
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
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch products";
      toast.error("Error fetching products", {
        description: errorMessage,
      });
      set({ products: [] });
    }
  },

  addProduct: async (productData: Partial<Product>) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      set((state) => ({
        products: [...state.products, response.data.product],
      }));
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
}));
