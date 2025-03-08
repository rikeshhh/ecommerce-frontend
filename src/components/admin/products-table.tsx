"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useUserStore } from "@/store/userStore";
import { useProductStore } from "@/store/product-store";

const columns = [
  { accessorKey: "_id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
];

export default function ProductsTable() {
  const { products, fetchProducts } = useProductStore();
  const { isAdmin } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (isAdmin) {
        await fetchProducts();
      }
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts, isAdmin]);

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div className="text-center">Loading products...</div>;
  if (!isAdmin) return <div className="text-center">Unauthorized</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Products</h2>
      {products.length === 0 ? (
        <div className="text-center">No products found</div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
