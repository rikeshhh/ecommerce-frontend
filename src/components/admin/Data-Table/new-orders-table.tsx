/* eslint-disable */
"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Order } from "@/lib/types/order-type";
import { TableFilters } from "./table-filter";
import { TableContent } from "./table-content";
import { TablePagination } from "./table-pagination";
import { TableSkeleton } from "./table-skeleton";
import { useOrdersTableState } from "@/hooks/useOrdersTableState";
import { useOrdersTableFetch } from "@/hooks/useOrdersTableFetch";
import { getOrderColumns } from "../admin-order-table/orderColumns";

interface Filters {
  search?: string;
  status?: string;
  createdAt?: { from: string; to: string };
}

interface OrdersDataTableProps {
  title: string;
  data: Order[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
  fetchData: (
    page: number,
    limit: number,
    filters: Filters
  ) => Promise<{ items: Order[]; totalItems: number; totalPages: number }>;
  initialPage?: number;
  initialLimit?: number;
}

export function OrdersDataTable({
  title,
  data,
  handleStatusChange,
  fetchData,
  initialPage = 1,
  initialLimit = 10,
}: OrdersDataTableProps) {
  const state = useOrdersTableState(data, initialPage, initialLimit);
  const { fetchDataWithFilters, updateUrl } = useOrdersTableFetch({
    fetchData,
    state,
    initialData: data,
  });

  const {
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
    setSearchQuery,
    setDateRange,
    setStatusFilter,
    setAppliedSearchQuery,
    setLimit,
  } = state;

  const columns = getOrderColumns(handleStatusChange);
  const filterOptions = {
    statusOptions: [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],
    dateField: "createdAt" as const,
  };

  useEffect(() => {
    fetchDataWithFilters(currentPage);
  }, [
    appliedSearchQuery,
    dateRange,
    statusFilter,
    currentPage,
    fetchDataWithFilters,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery !== appliedSearchQuery) {
        setAppliedSearchQuery(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, appliedSearchQuery, setAppliedSearchQuery]);

  const handlePageChange = (page: number) => {
    fetchDataWithFilters(page);
    updateUrl(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    fetchDataWithFilters(1);
    updateUrl(1);
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 p-4 max-w-full mx-auto">
      <TableFilters
        title={title}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        appliedSearchQuery={appliedSearchQuery}
        setAppliedSearchQuery={setAppliedSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filterOptions={filterOptions}
        fetchDataWithFilters={fetchDataWithFilters}
        updateUrl={updateUrl}
        currentPage={currentPage}
      />
      <Card>
        <TableContent
          title={title}
          items={items}
          columns={columns}
          filterOptions={filterOptions}
          dateRange={dateRange}
          orderConfirmation={false}
        />
        {totalPages > 1 && (
          <TablePagination
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            handlePageChange={handlePageChange}
            handleLimitChange={handleLimitChange}
            filteredDataLength={items.length}
          />
        )}
      </Card>
    </div>
  );
}
