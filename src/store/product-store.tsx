"use client";

import { create } from "zustand";
import axios from "axios";
import { Product } from "@/lib/types";

interface Category {
  name: string;
  slug: string;
  image: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  totalProducts: number;
  recommendations: Product[];
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
  fetchRecommendations: (userId: string) => Promise<void>;
  addProduct: (data: FormData) => Promise<Product>;
  fetchCategories: () => Promise<Category[]>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categories: [],
  recommendations: [],
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
    console.log("fetchProducts called with:", {
      page,
      limit,
      search,
      from,
      to,
      category,
      exclude,
    });
    try {
      const safePage = Math.max(1, parseInt(String(page), 10) || 1);
      const safeLimit = Math.max(1, parseInt(String(limit), 10) || 10);

      const params = {
        page: safePage,
        limit: safeLimit,
        search: search?.trim() || undefined,
        from: from || undefined,
        to: to || undefined,
        category: category || undefined,
        exclude: exclude || undefined,
      };

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

      if (search && search.trim()) {
        try {
          const token = localStorage.getItem("authToken");
          const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/search-history`,
            { query: search.trim() },
            config
          );
        } catch (logError) {
          console.error("Failed to log search (non-critical):", logError);
        }
      }

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
      const product = response.data.product;
      if (!product) throw new Error("Product not found in response");

      const updatedProduct = {
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
      };

      set({ selectedProduct: updatedProduct, loading: false });
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch product";
      console.error("Fetch Product Error:", err);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchRecommendations: async (userId) => {
    set({ loading: true, error: undefined });
    try {
      const params = userId ? { userId } : {};
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`,
        { params }
      );

      const recommendations = response.data.recommendations || [];
      set({ recommendations, loading: false });
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to fetch recommendations";
      console.error("Fetch Recommendations Error:", err);
      set({ error: errorMessage, loading: false, recommendations: [] });
    }
  },

  addProduct: async (data: FormData) => {
    set({ loading: true, error: undefined });
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication required");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.exp * 1000 < Date.now()) {
        throw new Error("Token expired");
      }

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

      console.log("Added Product:", updatedProduct);

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

  fetchCategories: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          params: { page: 1, limit: 100 },
        }
      );

      const products = response.data.products || [];
      const uniqueCategories = Array.from(
        new Set(products.map((p: Product) => p.category))
      )
        .filter((category): category is string => !!category)
        .map((category) => {
          const firstProduct = products.find(
            (p: Product) => p.category === category
          );
          return {
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            image: firstProduct?.image || "/placeholder.png",
          };
        });

      set({ categories: uniqueCategories, loading: false });
      return uniqueCategories;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load categories";
      console.error("Fetch Categories Error:", err);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },
  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    set((state) => ({
      products: state.products.map((p) =>
        p._id === id ? { ...p, ...response.data } : p
      ),
    }));
  },
  deleteProduct: async (id: string) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    set((state) => ({
      products: state.products.filter((p) => p._id !== id),
    }));
  },
  reset: async () => {
    set({
      products: [],
      categories: [],
      recommendations: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      loading: false,
      error: undefined,
      selectedProduct: null,
    });
  },
}));
