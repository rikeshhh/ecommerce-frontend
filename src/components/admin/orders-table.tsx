"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useUserStore } from "@/store/userStore";
import { useOrderStore } from "@/store/order-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Pagination } from "../ui/pagination";

const columns: ColumnDef<any>[] = [
  { accessorKey: "_id", header: "Order ID" },
  {
    accessorKey: "user.name",
    header: "Customer",
    cell: ({ row }) => row.original.user?.name || "Unknown Customer",
  },
  {
    accessorFn: (row) => row.products?.length || 0,
    header: "Products",
    id: "productsCount",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => `$${row.original.totalAmount?.toFixed(2) || "0.00"}`,
    sortingFn: "basic",
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const { updateOrder } = useOrderStore.getState();
      return (
        <Select
          defaultValue={row.original.status || "Pending"}
          onValueChange={(value) => updateOrder(row.original._id, value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Placed">Placed</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const { updateOrder } = useOrderStore.getState();
      return (
        <Select
          defaultValue={row.original.paymentStatus || "Pending"}
          onValueChange={(value) =>
            updateOrder(row.original._id, undefined, value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString() || "N/A",
    sortingFn: "datetime",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details - {order._id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <strong>Customer:</strong>{" "}
                {order.user?.name || "Unknown Customer"}
              </div>
              <div>
                <strong>Total Amount:</strong> $
                {order.totalAmount?.toFixed(2) || "0.00"}
              </div>
              <div>
                <strong>Order Status:</strong> {order.status || "Pending"}
              </div>
              <div>
                <strong>Payment Status:</strong>{" "}
                {order.paymentStatus || "Pending"}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString() || "N/A"}
              </div>
              <div>
                <strong>Products:</strong>
                <ul className="list-disc pl-5">
                  {order.products && order.products.length > 0 ? (
                    order.products.map(
                      (
                        item: {
                          product?: {
                            _id?: string;
                            name?: string;
                            price?: number;
                          };
                          quantity?: number;
                        },
                        index: number
                      ) => (
                        <li key={item.product?._id || index}>
                          {item.product?.name || "Unknown Product"} (x
                          {item.quantity || 0}) - $
                          {(
                            (item.product?.price ?? 0) * (item.quantity ?? 0)
                          ).toFixed(2)}
                        </li>
                      )
                    )
                  ) : (
                    <li>No products available</li>
                  )}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export default function OrdersTable() {
  const { orders, fetchOrders, totalOrders, currentPage, totalPages, limit } =
    useOrderStore();
  const { isAdmin } = useUserStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  console.log("Orders from store:", orders);

  useEffect(() => {
    const loadOrders = async () => {
      if (isAdmin) await fetchOrders(1, 10);
      setLoading(false);
    };
    loadOrders();
  }, [fetchOrders, isAdmin]);

  const table = useReactTable({
    data: orders || [],
    columns,
    state: {
      sorting,
      pagination: { pageIndex: currentPage - 1, pageSize: limit },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    await fetchOrders(newPage, limit);
    table.setPageIndex(newPage - 1);
    setLoading(false);
  };

  if (loading)
    return (
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin inline-block" /> Loading
        orders...
      </div>
    );
  if (!isAdmin) return <div className="text-center">Unauthorized</div>;

  console.log("Table rows:", table.getRowModel().rows);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      {orders?.length === 0 ? (
        <div className="text-center">No orders found</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(orders || []).length} of {totalOrders} orders{" "}
            </div>
            <div className="flex items-center space-x-4">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  const newLimit = parseInt(value);
                  fetchOrders(1, newLimit);
                  table.setPageSize(newLimit);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
