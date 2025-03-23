"use client";

import { useEffect, useCallback, useRef } from "react";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/lib/types/product-type";

export function useProductsTableLogic(initialLimit: number = 10) {
  const { products, loading, fetchProducts, deleteProduct, updateProduct } =
    useProductStore();
  const hasFetchedInitially = useRef(false);

  useEffect(() => {
    if (!hasFetchedInitially.current) {
      console.log(`Fetching initial products with limit: ${initialLimit}`);
      fetchProducts({ page: 1, limit: initialLimit });
      hasFetchedInitially.current = true;
    }
  }, [fetchProducts, initialLimit]);

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
      const result = await fetchProducts({ page, limit, ...filters });
      console.log("handleFetchData result:", result);
      return result;
    },
    [fetchProducts]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      if (confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id);
        await handleFetchData(1, initialLimit, {});
      }
    },
    [deleteProduct, handleFetchData, initialLimit]
  );

  const handleUpdateProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      await updateProduct(id, data);
      await handleFetchData(1, initialLimit, {});
    },
    [updateProduct, handleFetchData, initialLimit]
  );

  return {
    products,
    loading,
    handleFetchData,
    handleDeleteProduct,
    handleUpdateProduct,
  };
}
