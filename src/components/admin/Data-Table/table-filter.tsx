/* eslint-disable */

import { useState } from "react";
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
import { Search, CalendarIcon, Filter, X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface TableFiltersProps<T> {
  title: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  appliedSearchQuery?: string;
  setAppliedSearchQuery: (value: string | undefined) => void;
  dateRange?: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  filterOptions: { statusOptions?: string[]; dateField?: string };
  fetchDataWithFilters: (range?: DateRange, search?: string) => Promise<void>;
  updateUrl: (page: number) => void;
  currentPage: number;
}

export function TableFilters<T>({
  title,
  searchQuery,
  setSearchQuery,
  appliedSearchQuery,
  setAppliedSearchQuery,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  filterOptions,
  fetchDataWithFilters,
  updateUrl,
  currentPage,
}: TableFiltersProps<T>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  return (
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

      {appliedSearchQuery && (
        <div className="text-sm text-red-500 flex items-center flex-wrap gap-1">
          Showing results for:
          <span className="font-medium">{appliedSearchQuery}</span>
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
    </>
  );
}
