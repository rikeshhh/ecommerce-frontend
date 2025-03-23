"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Order } from "@/lib/types/order-type";

interface OrdersTableState {
  currentPage: number;
  limit: number;
  items: Order[];
  totalItems: number;
  totalPages: number;
  loading: boolean;
  searchQuery: string;
  dateRange: DateRange | undefined;
  statusFilter: string | null;
  appliedSearchQuery: string | undefined;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setItems: (items: Order[]) => void;
  setTotalItems: (total: number) => void;
  setTotalPages: (pages: number) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: DateRange | undefined) => void;
  setStatusFilter: (status: string | null) => void;
  setAppliedSearchQuery: (query: string | undefined) => void;
}

export function useOrdersTableState(
  initialData: Order[],
  initialPage: number = 1,
  initialLimit: number = 10
): OrdersTableState {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [items, setItems] = useState<Order[]>(initialData);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<
    string | undefined
  >(undefined);

  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const status = searchParams.get("status");
    const page = parseInt(
      searchParams.get("page") || initialPage.toString(),
      10
    );
    const limitParam = parseInt(
      searchParams.get("limit") || initialLimit.toString(),
      10
    );

    setSearchQuery(q);
    setAppliedSearchQuery(q);
    setStatusFilter(status);
    setCurrentPage(page);
    setLimit(limitParam);

    if (from && to) {
      const newRange = { from: new Date(from), to: new Date(to) };
      setDateRange(newRange);
    } else if (dateRange) {
      setDateRange(undefined);
    }
  }, [searchParams, initialPage, initialLimit, dateRange]);

  return {
    currentPage,
    limit,
    items,
    totalItems,
    totalPages,
    loading,
    searchQuery,
    dateRange,
    statusFilter,
    appliedSearchQuery,
    setCurrentPage,
    setLimit,
    setItems,
    setTotalItems,
    setTotalPages,
    setLoading,
    setSearchQuery,
    setDateRange,
    setStatusFilter,
    setAppliedSearchQuery,
  };
}
