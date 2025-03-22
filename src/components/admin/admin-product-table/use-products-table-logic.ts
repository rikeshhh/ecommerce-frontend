"use client";

import { useEffect, useCallback, useRef } from "react";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/lib/types/product-type";

export function useProductsTableLogic() {
  const { products, loading, fetchProducts, deleteProduct, updateProduct } =
    useProductStore();

  const hasFetchedInitially = useRef(false); 

  useEffect(() => {
    if (!hasFetchedInitially.current && products.length === 0) {
      console.log("Fetching initial products...");
      fetchProducts({ page: 1, limit: 10 });
      hasFetchedInitially.current = true; 
    }
  }, [fetchProducts, products.length]);

  const handleFetchData = useCallback(
    async (
      page: number,
      limit: number,
      filters: {
        search?: string;
        category?: string;
        from?: string;
        to?: string;
      }
    ) => {
      console.log("handleFetchData called with:", { page, limit, filters });
      try {
        const result = await fetchProducts({ page, limit, ...filters });
        console.log("Fetch result:", result);
        return result;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    [fetchProducts] 
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await deleteProduct(id);
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    },
    [deleteProduct]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      try {
        await updateProduct(id, data); 
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    [updateProduct]
  );

  return {
    products,
    loading,
    handleFetchData,
    handleDeleteProduct,
    handleUpdateProduct,
  };
}
