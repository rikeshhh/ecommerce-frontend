"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PaginationState<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

interface PaginationOptions<T> {
  store: {
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    fetchItems: (page: number, limit: number) => Promise<void>;
  };
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = <T>({
  store,
  initialPage = 1,
  initialLimit = 10,
}: PaginationOptions<T>) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        await store.fetchItems(initialPage, initialLimit);
      } catch (error) {
        toast.error("Error fetching items", {
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [store.fetchItems, initialPage, initialLimit]);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > store.totalPages) return;
    try {
      setLoading(true);
      await store.fetchItems(newPage, store.limit);
    } catch (error) {
      toast.error("Error changing page", {
        description: "Failed to fetch page data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = async (newLimit: number) => {
    try {
      setLoading(true);
      await store.fetchItems(1, newLimit);
    } catch (error) {
      toast.error("Error changing limit", {
        description: "Failed to update limit.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    items: store.items,
    totalItems: store.totalItems,
    currentPage: store.currentPage,
    totalPages: store.totalPages,
    limit: store.limit,
    loading,
    handlePageChange,
    handleLimitChange,
  };
};
