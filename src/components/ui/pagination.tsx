"use client";

import * as React from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
}

const Pagination = React.memo(
  ({
    totalPages,
    currentPage,
    onPageChange,
    showFirstLast = true,
    siblingCount = 1,
    className,
    ...props
  }: PaginationProps) => {
    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const getPageNumbers = (): (number | "...")[] => {
      const safeTotalPages = Math.max(1, totalPages);
      const totalNumbers = siblingCount * 2 + 3;
      if (safeTotalPages <= totalNumbers) {
        return range(1, safeTotalPages);
      }

      const safeCurrentPage = Math.max(
        1,
        Math.min(currentPage, safeTotalPages)
      );
      const leftSiblingIndex = Math.max(safeCurrentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(
        safeCurrentPage + siblingCount,
        safeTotalPages
      );

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < safeTotalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftRange = range(1, totalNumbers - 2);
        return [...leftRange, "...", safeTotalPages];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightRange = range(
          safeTotalPages - (totalNumbers - 3),
          safeTotalPages
        );
        return [1, "...", ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [1, "...", ...middleRange, "...", safeTotalPages];
      }

      return range(1, safeTotalPages);
    };

    const pageNumbers = getPageNumbers();

    return (
      <nav
        className={cn(
          "flex items-center  sm:space-x-2 flex-wrap gap-2 justify-center ",
          className
        )}
        {...props}
      >
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className="size-6 sm:size-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="size-6 sm:size-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="text-gray-500 text-xs sm:text-sm px-1 sm:px-2"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="sm:size-8 size-6 p-0 text-xs sm:text-sm"
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="sm:size-8 size-6 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="sm:size-8 size-6 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
