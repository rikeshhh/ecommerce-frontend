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
import { Search, CalendarIcon, Filter, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn, normalizeImageUrl } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import { Pagination } from "../ui/pagination";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  isImage?: boolean;
}

interface FilterOptions {
  statusOptions?: string[];
  dateField?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  fetchData: (page: number, limit: number, filters: any) => Promise<void>;
  filterOptions?: FilterOptions;
  initialPage?: number;
  initialLimit?: number;
}

export function DataTable<T>({
  title,
  data,
  columns,
  fetchData,
  filterOptions = {},
  initialPage = 1,
  initialLimit = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<
    string | undefined
  >(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [paginationStore, setPaginationStore] = useState({
    items: data,
    totalItems: 0,
    currentPage: initialPage,
    totalPages: 1,
    limit: initialLimit,
    fetchItems: async (page: number, limit: number) => {
      const filters = {
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
      await fetchData(page, limit, filters);
    },
  });

  useEffect(() => {
    setPaginationStore((prev) => ({
      ...prev,
      items: data,
    }));
  }, [data]);

  const {
    items,
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
      const filters = {
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
      console.log("Fetching data with filters:", filters);
      try {
        await fetchData(currentPage, limit, filters);
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    },
    [
      appliedSearchQuery,
      dateRange,
      statusFilter,
      fetchData,
      filterOptions.dateField,
      currentPage,
      limit,
    ]
  );

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (appliedSearchQuery) params.set("q", appliedSearchQuery);
    if (dateRange?.from) params.set("from", dateRange.from.toISOString());
    if (dateRange?.to) params.set("to", dateRange.to.toISOString());
    if (statusFilter) params.set("status", statusFilter);
    if (currentPage) params.set("page", currentPage.toString());
    if (limit) params.set("limit", limit.toString());

    const newUrl = `${pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newUrl, { scroll: false });
  }, [
    appliedSearchQuery,
    dateRange,
    statusFilter,
    pathname,
    router,
    currentPage,
    limit,
  ]);

  useEffect(() => {
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

    if (page !== currentPage) {
      handlePageChange(page);
      shouldFetch = true;
    }

    if (limitParam !== limit) {
      handleLimitChange(limitParam);
      shouldFetch = true;
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

    if (shouldFetch) {
      fetchDataWithFilters();
    }
  }, [
    searchParams,
    fetchDataWithFilters,
    currentPage,
    limit,
    handlePageChange,
    handleLimitChange,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDataWithFilters(undefined, searchQuery);
    updateUrl();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearchQuery(undefined);
    fetchDataWithFilters();
    updateUrl();
  };

  const filteredData = useMemo(() => {
    let result = [...items];
    if (dateRange?.from && dateRange?.to && filterOptions.dateField) {
      result = result.filter((item) => {
        const dateStr = (item as any)[filterOptions.dateField!];
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const isDateValid = isValid(date);
        if (!isDateValid) return false;
        const withinRange = date >= dateRange.from! && date <= dateRange.to!;
        return withinRange;
      });
    }
    return result;
  }, [items, dateRange, filterOptions]);

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[280px]" />
            {filterOptions.statusOptions && (
              <Skeleton className="h-10 w-[150px]" />
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key as string}>
                      <Skeleton className="h-6 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((col) => (
                        <TableCell key={col.key as string}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="submit">Search</Button>
          {filterOptions.dateField && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
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
                    <span>Pick a date range</span>
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
                      updateUrl();
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
                <Button variant="outline" className="w-[150px]">
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
                      updateUrl();
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </form>

      {appliedSearchQuery && (
        <div className="text-sm text-red-500">
          Showing results for:{" "}
          <span className="font-medium">"{appliedSearchQuery}"</span>
          <Button
            variant="link"
            size="sm"
            className="ml-2 p-0"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key as string}>{col.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length ? (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((col) => (
                      <TableCell key={col.key as string}>
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
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                  >
                    No {title.toLowerCase()} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {totalItems} items
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Items per page:
                </span>
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border rounded p-1"
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
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
