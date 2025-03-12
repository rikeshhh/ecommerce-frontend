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
    from?: string;
    to?: string;
  }) => Promise<{
    items: Product[];
    totalItems: number;
    totalPages: number;
  }>;
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
  error: undefined,
  selectedProduct: null,

  fetchProducts: async ({
    page = 1,
    limit = 10,
    search,
    from,
    to,
    category,
    exclude,
  } = {}) => {
    set({ loading: true, error: undefined });
    try {
      console.log("fetchProducts params:", {
        page,
        limit,
        search,
        from,
        to,
        category,
        exclude,
      });

      const params = {
        page,
        limit,
        search: search || undefined,
        from: from || undefined,
        to: to || undefined,
        category: category || undefined,
        exclude: exclude || undefined,
      };

      console.log("Sending params to API:", params);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        { params }
      );

      const {
        products: rawProducts,
        totalProducts,
        currentPage,
        totalPages,
        limit: responseLimit,
      } = response.data;

      const products = rawProducts.map((product: Product) => ({
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
      }));

      console.log(
        `Fetched ${products.length} products for category: ${
          category || "all"
        }`,
        products
      );

      set({
        products,
        totalProducts,
        currentPage,
        totalPages,
        limit: responseLimit,
        loading: false,
      });
      return {
        items: products,
        totalItems: totalProducts,
        totalPages,
      };
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load products";
      console.error("Fetch Products Error:", err);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
      const updatedProduct = {
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
      };
      set({ selectedProduct: updatedProduct, loading: false });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch product";
      console.error("Fetch Product Error:", errorMessage);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  addProduct: async (data: FormData) => {
    set({ loading: true, error: undefined });
    try {
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
      const updatedProduct = {
        ...newProduct,
        createdAt: newProduct.createdAt || new Date().toISOString(),
      };

      set((state) => ({
        products: [...state.products, updatedProduct],
        totalProducts: state.totalProducts + 1,
        loading: false,
      }));

      return updatedProduct;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add product";
      console.error("Add Product Error:", err);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
}));
