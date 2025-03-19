/* eslint-disable */

import { useState, useEffect, useCallback } from "react";

export function useDataTableLogic<T>({
  data,
  fetchData,
  initialPage,
  initialLimit,
}: {
  data: T[];
  fetchData: (
    page: number,
    limit: number,
    filters: any
  ) => Promise<{ items: T[]; totalItems: number; totalPages: number }>;
  filterOptions: any;
  initialPage: number;
  initialLimit: number;
}) {
  const [items, setItems] = useState<T[]>(data);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {}
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchDataWithFilters = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const filters = {
          search: appliedSearchQuery || undefined,
          createdAt: dateRange.from || dateRange.to ? dateRange : undefined,
          status: statusFilter || undefined,
        };
        console.log("Fetching with:", { page, limit, filters });
        const result = await fetchData(page, limit, filters);
        setItems(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, limit, appliedSearchQuery, dateRange, statusFilter]
  );

  useEffect(() => {
    if (items.length === 0) {
      fetchDataWithFilters(initialPage);
    }
  }, [fetchDataWithFilters, initialPage, items.length]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchDataWithFilters(page);
    },
    [fetchDataWithFilters]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setCurrentPage(1);
      fetchDataWithFilters(1);
    },
    [fetchDataWithFilters]
  );

  return {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    statusFilter,
    setStatusFilter,
    appliedSearchQuery,
    setAppliedSearchQuery,
    items,
    totalItems,
    currentPage,
    totalPages,
    limit,
    loading,
    handlePageChange,
    handleLimitChange,
    fetchDataWithFilters,
  };
}
