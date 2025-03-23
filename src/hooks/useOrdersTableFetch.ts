"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Order } from "@/lib/types/order-type";

interface Filters {
  search?: string;
  status?: string;
  createdAt?: { from: string; to: string };
}

interface FetchOrdersParams {
  fetchData: (
    page: number,
    limit: number,
    filters: Filters
  ) => Promise<{ items: Order[]; totalItems: number; totalPages: number }>;
  state: {
    currentPage: number;
    limit: number;
    items: Order[];
    totalItems: number;
    totalPages: number;
    loading: boolean;
    appliedSearchQuery: string | undefined;
    dateRange: DateRange | undefined;
    statusFilter: string | null;
    setItems: (items: Order[]) => void;
    setTotalItems: (total: number) => void;
    setTotalPages: (pages: number) => void;
    setCurrentPage: (page: number) => void;
    setLoading: (loading: boolean) => void;
  };
  initialData: Order[];
}

export function useOrdersTableFetch({
  fetchData,
  state,
  initialData,
}: FetchOrdersParams) {
  const {
    currentPage,
    limit,
    items,
    appliedSearchQuery,
    dateRange,
    statusFilter,
    setItems,
    setTotalItems,
    setTotalPages,
    setCurrentPage,
    setLoading,
  } = state;

  const router = useRouter();
  const pathname = usePathname();

  const fetchDataWithFilters = useCallback(
    async (
      page: number,
      overrideRange?: DateRange,
      overrideSearch?: string
    ) => {
      setLoading(true);
      const effectiveRange = overrideRange || dateRange;
      const effectiveSearch =
        overrideSearch !== undefined ? overrideSearch : appliedSearchQuery;
      const filters: Filters = {
        search: effectiveSearch || undefined,
        createdAt:
          effectiveRange?.from && effectiveRange?.to
            ? {
                from: effectiveRange.from.toISOString(),
                to: effectiveRange.to.toISOString(),
              }
            : undefined,
        status: statusFilter || undefined,
      };
      try {
        const result = await fetchData(page, limit, filters);
        setItems(result.items);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      fetchData,
      limit,
      appliedSearchQuery,
      dateRange,
      statusFilter,
      setItems,
      setTotalItems,
      setTotalPages,
      setCurrentPage,
      setLoading,
    ]
  );

  useEffect(() => {
    setItems(initialData);
  }, [initialData, setItems]);

  useEffect(() => {
    if (items.length === 0) {
      fetchDataWithFilters(currentPage);
    }
  }, [items.length, currentPage, fetchDataWithFilters]);

  const updateUrl = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      if (appliedSearchQuery) params.set("q", appliedSearchQuery);
      if (dateRange?.from) params.set("from", dateRange.from.toISOString());
      if (dateRange?.to) params.set("to", dateRange.to.toISOString());
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", newPage.toString());
      params.set("limit", limit.toString());
      router.replace(
        `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false }
      );
    },
    [appliedSearchQuery, dateRange, statusFilter, pathname, router, limit]
  );

  return { fetchDataWithFilters, updateUrl };
}
