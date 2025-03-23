"use client";

import { create } from "zustand";
import { Category, Product, ProductState } from "@/lib/types/product-type";
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  fetchCategories,
  updateProduct,
  deleteProduct,
} from "@/lib/api/product-api";
import { toast } from "sonner";

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
    try {
      const result = await fetchProducts({
        page,
        limit,
        search,
        from,
        to,
        category,
        exclude,
      });
      set({
        products: result.items,
        totalProducts: result.totalItems,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        limit: result.limit,
        loading: false,
      });
      return {
        items: result.items,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load products";
      set({ error: errorMessage, loading: false });
      toast.error("Error fetching products", { description: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchProductById: async (id: string): Promise<void> => {
    set({ loading: true, error: undefined });
    try {
      const product = await fetchProductById(id);
      set({ selectedProduct: product, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch product";
      set({ loading: false, error: errorMessage });
      toast.error("Error fetching product", { description: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchRecommendations: async (): Promise<void> => {
    set({ loading: true, error: undefined });
    try {
      set({ recommendations: [], loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch recommendations";
      set({ loading: false, error: errorMessage });
      toast.error("Error fetching recommendations", {
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  addProduct: async (data: FormData): Promise<Product> => {
    set({ loading: true, error: undefined });
    try {
      const newProduct = await addProduct(data);
      set((state) => ({
        products: [...state.products, newProduct],
        totalProducts: state.totalProducts + 1,
        loading: false,
      }));
      return newProduct;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add product";
      set({ error: errorMessage, loading: false });
      toast.error("Error adding product", { description: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchCategories: async (): Promise<Category[]> => {
    set({ loading: true, error: undefined });
    try {
      const categories = await fetchCategories();
      set({ categories, loading: false });
      return categories;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load categories";
      set({ error: errorMessage, loading: false });
      toast.error("Error fetching categories", { description: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(id, data);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, ...updatedProduct } : p
        ),
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      toast.error("Error updating product", { description: errorMessage });
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      toast.error("Error deleting product", { description: errorMessage });
      throw new Error(errorMessage);
    }
  },

  reset: async (): Promise<void> => {
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
