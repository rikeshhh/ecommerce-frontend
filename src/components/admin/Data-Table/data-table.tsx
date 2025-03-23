/* eslint-disable */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { TableContent } from "./table-content";
import { TableFilters } from "./table-filter";
import { TableSkeleton } from "./table-skeleton";
import { TablePagination } from "./table-pagination";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  isImage?: boolean;
  hiddenOnMobile?: boolean;
}

interface FilterOptions {
  statusOptions?: string[];
  dateField?: string;
}

interface Filters {
  search?: string;
  status?: string;
  [key: string]: string | { from: string; to: string } | undefined;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  fetchData: (
    page: number,
    limit: number,
    filters: Filters
  ) => Promise<{ items: T[]; totalItems: number; totalPages: number }>;
  filterOptions?: FilterOptions;
  initialPage?: number;
  initialLimit?: number;
  orderConfirmation?: boolean;
}

export function DataTable<T>({
  title,
  data = [],
  columns,
  fetchData,
  filterOptions = {},
  initialPage = 1,
  initialLimit = 10,
  orderConfirmation = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<
    string | undefined
  >(undefined);
  const [hasFetched, setHasFetched] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paginationStore = useMemo(
    () => ({
      items: data,
      totalItems: 0,
      currentPage: initialPage,
      totalPages: 1,
      limit: initialLimit,
      fetchItems: async (page: number, limit: number) => {
        const filters: Filters = {
          search: appliedSearchQuery || undefined,
          [filterOptions.dateField || "createdAt"]:
            dateRange?.from && dateRange?.to
              ? {
                  from: dateRange.from.toISOString(),
                  to: dateRange.to.toISOString(),
                }
              : undefined,
          status: statusFilter || undefined,
        };
        const result = await fetchData(page, limit, filters);
        setHasFetched(true);
        return result;
      },
    }),
    [fetchData, appliedSearchQuery, dateRange, statusFilter, data, initialLimit]
  );

  const {
    items = [],
    totalItems,
    currentPage,
    totalPages,
    limit,
    loading,
    handlePageChange,
    handleLimitChange,
  } = usePagination({ store: paginationStore, initialPage, initialLimit });

  useEffect(() => {
    if (!hasFetched && data.length === 0) {
      handlePageChange(initialPage);
    }
  }, [hasFetched, data.length, handlePageChange, initialPage]);

  const fetchDataWithFilters = useCallback(
    async (overrideRange?: DateRange, overrideSearch?: string) => {
      const effectiveRange = overrideRange || dateRange;
      const effectiveSearch =
        overrideSearch !== undefined ? overrideSearch : appliedSearchQuery;
      const filters: Filters = {
        search: effectiveSearch || undefined,
        [filterOptions.dateField || "createdAt"]:
          effectiveRange?.from && effectiveRange?.to
            ? {
                from: effectiveRange.from.toISOString(),
                to: effectiveRange.to.toISOString(),
              }
            : undefined,
        status: statusFilter || undefined,
      };
      await handlePageChange(currentPage);
    },
    [appliedSearchQuery, dateRange, statusFilter, currentPage, handlePageChange]
  );

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

    let shouldFetch = false;
    if (q !== appliedSearchQuery) {
      setSearchQuery(q);
      setAppliedSearchQuery(q);
      shouldFetch = true;
    }
    if (status !== statusFilter) {
      setStatusFilter(status);
      shouldFetch = true;
    }
    if (limitParam !== limit) {
      handleLimitChange(limitParam);
      shouldFetch = true;
    }
    if (from && to) {
      const newRange = { from: new Date(from), to: new Date(to) };
      if (
        dateRange?.from?.toISOString() !== newRange.from.toISOString() ||
        dateRange?.to?.toISOString() !== newRange.to.toISOString()
      ) {
        setDateRange(newRange);
        shouldFetch = true;
      }
    } else if (dateRange) {
      setDateRange(undefined);
      shouldFetch = true;
    }
    if (shouldFetch) {
      fetchDataWithFilters();
    } else if (page !== currentPage) {
      handlePageChange(page);
    }
  }, [
    searchParams,
    fetchDataWithFilters,
    appliedSearchQuery,
    statusFilter,
    dateRange,
    currentPage,
    limit,
    handlePageChange,
    handleLimitChange,
    initialPage,
    initialLimit,
  ]);

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 p-4 max-w-full mx-auto">
      {!orderConfirmation && (
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
      )}
      <Card>
        <TableContent
          title={title}
          items={items}
          columns={columns}
          filterOptions={filterOptions}
          dateRange={dateRange}
          orderConfirmation={orderConfirmation}
        />
        {!orderConfirmation && totalPages > 1 && (
          <TablePagination
            totalItems={totalItems}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            handlePageChange={(page) => {
              handlePageChange(page);
              updateUrl(page);
            }}
            handleLimitChange={handleLimitChange}
            filteredDataLength={items.length}
          />
        )}
      </Card>
    </div>
  );
}
