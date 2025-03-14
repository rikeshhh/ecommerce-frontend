"use client";

import { useEffect } from "react";
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
  const { products, fetchProducts, loading, totalPages } =
    useProductStore();

  useEffect(() => {
    console.log("Products:", products);
    products.forEach((product, index) => {
      console.log(`Product ${index} createdAt:`, product.createdAt);
    });
  }, [products]);

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
        console.log(
          `Rendering createdAt for ${product._id}:`,
          product.createdAt
        );
        const date = new Date(product.createdAt);
        return isValid(date) ? format(date, "LLL dd, y") : "Invalid Date";
      },
    },
  ];

  const handleFetchData = async (page: number, limit: number, filters: any) => {
    try {
      const response = await fetchProducts({
        page,
        limit,
        search: filters.search || "",
        from: filters.createdAt?.from || undefined,
        to: filters.createdAt?.to || undefined,
      });
      return;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts({ page: 1, limit: 10 });
  }, [fetchProducts]);

  return (
    <DataTable
      title="Products"
      data={products}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{ dateField: "createdAt" }}
      initialPage={1}
      initialLimit={10}
    />
  );
}
