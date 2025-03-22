/* eslint-disable */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { normalizeImageUrl } from "@/lib/utils/utils";
import { useMemo } from "react";
import { isValid } from "date-fns";
import { DateRange } from "react-day-picker";
import Image from "next/image";

interface TableContentProps<T> {
  title: string;
  items: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    isImage?: boolean;
    hiddenOnMobile?: boolean;
  }[];
  filterOptions: { statusOptions?: string[]; dateField?: string };
  dateRange?: DateRange;
  orderConfirmation: boolean;
}

export function TableContent<T>({
  title,
  items,
  columns,
  filterOptions,
  dateRange,
  orderConfirmation,
}: TableContentProps<T>) {
  const filteredData = useMemo(() => {
    let result = [...items];
    if (dateRange?.from && dateRange?.to && filterOptions.dateField) {
      result = result.filter((item) => {
        const dateStr = (item as any)[filterOptions.dateField!];
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return (
          isValid(date) && date >= dateRange.from! && date <= dateRange.to!
        );
      });
    }
    return result;
  }, [items, dateRange, filterOptions]);

  const responsiveColumns = useMemo(
    () =>
      columns.filter((col) => !col.hiddenOnMobile || window.innerWidth >= 640),
    [columns]
  );

  return (
    <>
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
                          <Image
                            height={300}
                            width={300}
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
      </CardContent>
    </>
  );
}
