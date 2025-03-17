/* eslint-disable */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, CalendarIcon, Filter, X, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import { normalizeImageUrl } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { Pagination } from "../ui/pagination";
import { cn } from "@/lib/utils";

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
  orderConfirmation?: boolean;
  initialLimit?: number;
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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
        console.log("Fetching items with:", { page, limit, filters });
        const result = await fetchData(page, limit, filters);
        console.log("fetchItems result:", result);
        setHasFetched(true);
        return result;
      },
    }),
    [fetchData, appliedSearchQuery, dateRange, statusFilter, data]
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
  } = usePagination({
    store: paginationStore,
    initialPage,
    initialLimit,
  });

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
      console.log("fetchDataWithFilters called:", filters);
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

      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      console.log("Updating URL:", newUrl);
      router.replace(newUrl, { scroll: false });
    },
    [appliedSearchQuery, dateRange, statusFilter, pathname, router, limit]
  );

  useEffect(() => {
    if (!hasFetched) return;

    const q = searchParams.get("q") || "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);

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
      return;
    }

    if (from && to && isValid(new Date(from)) && isValid(new Date(to))) {
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

    if (!hasFetched || shouldFetch) {
      if (page !== currentPage) {
        console.log("Syncing page from searchParams:", page);
        handlePageChange(page);
      }
    }

    if (shouldFetch) {
      fetchDataWithFilters();
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
    hasFetched,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
    fetchDataWithFilters(undefined, searchQuery);
    updateUrl(currentPage);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearchQuery(undefined);
    fetchDataWithFilters();
    updateUrl(currentPage);
  };

  const handlePageChangeWithUrl = useCallback(
    (page: number) => {
      handlePageChange(page);
      updateUrl(page);
    },
    [handlePageChange, updateUrl]
  );

  const filteredData = useMemo(() => {
    let result = [...(items || [])];
    if (dateRange?.from && dateRange?.to && filterOptions.dateField) {
      result = result.filter((item) => {
        const dateStr = (item as any)[filterOptions.dateField!];
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const isDateValid = isValid(date);
        if (!isDateValid) return false;
        return date >= dateRange.from! && date <= dateRange.to!;
      });
    }
    return result;
  }, [items, dateRange, filterOptions]);

  console.log("DataTable rendering, loading:", loading, "items:", items);

  const responsiveColumns = useMemo(() => {
    return columns.filter(
      (col) => !col.hiddenOnMobile || window.innerWidth >= 640
    );
  }, [columns]);

  if (loading) {
    return (
      <div className="p-4 max-w-full mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Skeleton className="h-10 w-full sm:w-[280px]" />
            {filterOptions.statusOptions && (
              <Skeleton className="h-10 w-full sm:w-[150px]" />
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-full mx-auto">
      {!orderConfirmation && (
        <>
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 text-base w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button type="submit" className="w-full sm:w-auto text-base py-2">
              Search
            </Button>
            <Button
              variant="outline"
              className="sm:hidden w-full py-2 text-base"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 transition-transform",
                  isFiltersOpen && "rotate-180"
                )}
              />
            </Button>
          </form>

          <div
            className={cn(
              "flex flex-col gap-2 sm:flex-row sm:gap-2 sm:items-center",
              !isFiltersOpen && "hidden sm:flex"
            )}
          >
            {filterOptions.dateField && (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[240px] justify-start text-left text-base py-2"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      if (range?.from && range?.to) {
                        fetchDataWithFilters(range);
                        updateUrl(currentPage);
                        setPopoverOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
            {filterOptions.statusOptions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[140px] text-base py-2"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {statusFilter || "Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  {filterOptions.statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        setStatusFilter(option);
                        fetchDataWithFilters();
                        updateUrl(currentPage);
                      }}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      )}

      {appliedSearchQuery && (
        <div className="text-sm text-red-500 flex items-center flex-wrap gap-1">
          Showing results for:{" "}
          <span className="font-medium">"{appliedSearchQuery}"</span>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-sm"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {responsiveColumns.map((col) => (
                    <TableHead
                      key={col.key as string}
                      className="text-sm whitespace-nowrap px-4 py-2"
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length ? (
                  filteredData.map((item, index) => (
                    <TableRow key={index}>
                      {responsiveColumns.map((col) => (
                        <TableCell
                          key={col.key as string}
                          className="text-sm px-4 py-3"
                        >
                          {col.isImage &&
                          typeof (item as any)[col.key] === "string" ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={normalizeImageUrl((item as any)[col.key])}
                                alt={(item as any).name || "Product"}
                                className="h-10 w-10 object-cover rounded"
                              />
                              {col.render
                                ? col.render(item)
                                : (item as any)[col.key]}
                            </div>
                          ) : col.render ? (
                            col.render(item)
                          ) : (
                            (item as any)[col.key]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={responsiveColumns.length}
                      className="text-center text-muted-foreground py-4 text-sm"
                    >
                      No {title.toLowerCase()} found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="sm:hidden space-y-4 p-4">
            {filteredData.length ? (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
                >
                  {responsiveColumns.map((col) => (
                    <div
                      key={col.key as string}
                      className="flex flex-col gap-1 py-2 border-b last:border-b-0"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {col.header}
                      </span>
                      <div className="text-sm">
                        {col.isImage &&
                        typeof (item as any)[col.key] === "string" ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={normalizeImageUrl((item as any)[col.key])}
                              alt={(item as any).name || "Product"}
                              className="h-12 w-12 object-cover rounded"
                            />
                            {col.render
                              ? col.render(item)
                              : (item as any)[col.key]}
                          </div>
                        ) : col.render ? (
                          col.render(item)
                        ) : (
                          (item as any)[col.key]
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No {title.toLowerCase()} found.
              </div>
            )}
          </div>

          {!orderConfirmation && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4 px-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {totalItems} items
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Per page:
                  </span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="border rounded p-1 text-sm w-16"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeWithUrl}
                    className="flex-wrap justify-center text-sm"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
