"use client";

import { create } from "zustand";
import axios from "axios";
import { Product } from "@/lib/types";

interface ProductState {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error?: string;
  selectedProduct: Product | null;
  fetchProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    exclude?: string;
  }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  addProduct: (data: FormData) => Promise<Product>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  loading: false,
  selectedProduct: null,

  fetchProducts: async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
    exclude = "",
  } = {}) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          params: {
            page,
            limit,
            search: search || undefined,
            category: category || undefined,
            exclude: exclude || undefined,
          },
        }
      );
      console.log("Fetched Products:", response.data.products);
      set({ products: response.data.products || [], loading: false });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch products";
      console.error("Fetch Products Error:", errorMessage);
      set({ loading: false, error: errorMessage });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );
      console.log("Fetched Product by ID:", response.data);
      const product = response.data.product;
      if (!product) throw new Error("Product not found in response");
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch product";
      console.error("Fetch Product Error:", errorMessage);
      set({ loading: false, error: errorMessage });
    }
  },

  addProduct: async (data: FormData) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const newProduct = response.data.product;
    set((state) => ({ products: [...state.products, newProduct] }));
    return newProduct;
  },
}));
