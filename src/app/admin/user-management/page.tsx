"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useUserStore } from "@/store/userStore";

import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import { useState, JSX } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";

const columns: ColumnDef<any>[] = [
  { accessorKey: "_id", header: "User ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "isAdmin",
    header: "Role",
    cell: ({ row }) => {
      const { updateUserRole } = useUserStore.getState();
      const user = row.original;
      return (
        <Select
          value={user.isAdmin ? "admin" : "user"}
          onValueChange={(value) => updateUserRole(user._id, value === "admin")}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { deleteUser } = useUserStore.getState();
      return (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteUser(row.original._id)}
        >
          Delete
        </Button>
      );
    },
  },
];

export default function UsersTable() {
  const { isAdmin, ...userStore } = useUserStore();
  const {
    items: users,
    totalItems,
    currentPage,
    totalPages,
    limit,
    loading,
    handlePageChange,
    handleLimitChange,
  } = usePagination({ store: userStore });

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users || [],
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

  if (loading)
    return (
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin inline-block" /> Loading
        users...
      </div>
    );
  if (!isAdmin) return <div className="text-center">Unauthorized</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      {users.length === 0 ? (
        <div className="text-center">No users found</div>
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
                    cell.column.columnDef.cell as (props: { row: any }) => JSX.Element,
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
              Showing {users.length} of {totalItems} users
            </div>
            <div className="flex items-center space-x-4">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <Select
                value={limit.toString()}
                onValueChange={(value) => handleLimitChange(parseInt(value))}
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
