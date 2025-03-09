"use client";

import { useProductStore } from "@/store/product-store";
import { DataTable } from "@/components/admin/data-table";
import { format, isValid } from "date-fns";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

export default function ProductsTable() {
  const { products, fetchProducts, loading } = useProductStore();

  const columns = [
    { key: "_id", header: "Product ID" },
    { key: "name", header: "Name" },
    {
      key: "price",
      header: "Price",
      render: (product: Product) => `$${product.price.toLocaleString()}`,
    },
    { key: "stock", header: "Stock" },
    {
      key: "createdAt",
      header: "Added On",
      render: (product: Product) => {
        const date = new Date(product.createdAt);
        return isValid(date) ? format(date, "LLL dd, y") : "Invalid Date";
      },
    },
  ];

  const handleFetchData = async (page: number, limit: number, filters: any) => {
    await fetchProducts({
      page,
      limit,
      search: filters.search || "",
      ...(filters.createdAt && {
        from: filters.createdAt.from,
        to: filters.createdAt.to,
      }),
    });
  };

  return (
    <DataTable
      title="Products"
      data={products}
      columns={columns}
      fetchData={handleFetchData}
      loading={loading}
      filterOptions={{ dateField: "createdAt" }}
    />
  );
}
