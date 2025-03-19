import { Pagination } from "@/components/ui/pagination";

interface TablePaginationProps {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  filteredDataLength: number;
}

export function TablePagination({
  totalItems,
  currentPage,
  totalPages,
  limit,
  handlePageChange,
  handleLimitChange,
  filteredDataLength,
}: TablePaginationProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4 px-4">
      <div className="text-sm text-muted-foreground">
        Showing {filteredDataLength} of {totalItems} items
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
            onPageChange={handlePageChange}
            className="flex-wrap justify-center text-sm"
          />
        )}
      </div>
    </div>
  );
}
