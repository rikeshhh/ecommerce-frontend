import { useState, useEffect } from "react";

interface PaginationStore<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  fetchItems: (
    page: number,
    limit: number
  ) => Promise<{
    items: T[];
    totalItems: number;
    totalPages: number;
  }>;
}

interface PaginationOptions<T> {
  store: PaginationStore<T>;
  initialPage: number;
  initialLimit: number;
}

export function usePagination<T>({
  store,
  initialPage,
  initialLimit,
}: PaginationOptions<T>) {
  const [state, setState] = useState(() => ({
    items: store.items || [],
    totalItems: store.totalItems || 0,
    currentPage: store.currentPage || initialPage,
    totalPages: store.totalPages || 1,
    limit: store.limit || initialLimit,
    loading: !store.items.length,
  }));

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > state.totalPages) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await store.fetchItems(page, state.limit);
      console.log("handlePageChange completed:", { page, result });
      setState((prev) => ({
        ...prev,
        items: result.items || [],
        totalItems: result.totalItems || 0,
        totalPages: result.totalPages || 1,
        currentPage: page,
        loading: false,
      }));
    } catch (error) {
      console.error("handlePageChange error:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLimitChange = async (limit: number) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const result = await store.fetchItems(1, limit);
      console.log("handleLimitChange completed:", { limit, result });
      setState((prev) => ({
        ...prev,
        items: result.items || [],
        totalItems: result.totalItems || 0,
        totalPages: result.totalPages || 1,
        currentPage: 1,
        limit,
        loading: false,
      }));
    } catch (error) {
      console.error("handleLimitChange error:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (state.items.length) return;
    const fetchInitialData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const result = await store.fetchItems(initialPage, initialLimit);
        console.log("Initial fetch completed:", result);
        setState((prev) => ({
          ...prev,
          items: result.items || [],
          totalItems: result.totalItems || 0,
          totalPages: result.totalPages || 1,
          currentPage: initialPage,
          limit: initialLimit,
          loading: false,
        }));
      } catch (error) {
        console.error("Initial fetch error:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchInitialData();
  }, [store.fetchItems, initialPage, initialLimit]);

  return {
    items: state.items,
    totalItems: state.totalItems,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    limit: state.limit,
    loading: state.loading,
    handlePageChange,
    handleLimitChange,
  };
}
