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
import { Search, CalendarIcon, Filter } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
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
  loading: boolean;
  filterOptions?: FilterOptions;
}

export function DataTable<T>({
  title,
  data,
  columns,
  fetchData,
  loading,
  filterOptions = {},
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fetchDataWithFilters = useCallback(
    async (overrideRange?: DateRange) => {
      const effectiveRange = overrideRange || dateRange;
      const filters = {
        search: searchQuery || undefined,
        [filterOptions.dateField || "createdAt"]:
          effectiveRange?.from && effectiveRange?.to
            ? {
                from: effectiveRange.from.toISOString(),
                to: effectiveRange.to.toISOString(),
              }
            : undefined,
        status: statusFilter || undefined,
      };
      console.log("Fetching with filters:", filters);
      await fetchData(1, 10, filters);
    },
    [searchQuery, dateRange, statusFilter, fetchData, filterOptions.dateField]
  );

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (dateRange?.from) params.set("from", dateRange.from.toISOString());
    if (dateRange?.to) params.set("to", dateRange.to.toISOString());
    if (statusFilter) params.set("status", statusFilter);

    const newUrl = `${pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, dateRange, statusFilter, pathname, router]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const status = searchParams.get("status");

    let shouldFetch = false;
    if (q !== searchQuery) {
      setSearchQuery(q);
      shouldFetch = true;
    }
    if (status !== statusFilter) {
      setStatusFilter(status);
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
  }, [searchParams, fetchDataWithFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDataWithFilters();
    updateUrl();
  };

  const filteredData = useMemo(() => {
    let result = [...data];
    if (dateRange?.from && dateRange?.to && filterOptions.dateField) {
      result = result.filter((item) => {
        const dateStr = (item as any)[filterOptions.dateField!];
        const date = new Date(dateStr);
        const isDateValid = isValid(date);
        if (!isDateValid) return false;
        const withinRange = date >= dateRange.from! && date <= dateRange.to!;
        return withinRange;
      });
    }
    return result;
  }, [data, dateRange, filterOptions]);

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
            className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex gap-4">
          {filterOptions.dateField && (
            <Popover>
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
                    }
                    updateUrl();
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
                        {col.render ? col.render(item) : (item as any)[col.key]}
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
        </CardContent>
      </Card>
    </div>
  );
}
