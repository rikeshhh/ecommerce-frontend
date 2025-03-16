"use client";

import { useCallback } from "react";
import { useProductStore } from "@/store/product-store";
import { DataTable } from "@/components/admin/data-table";
import { format, isValid } from "date-fns";
import { Product } from "@/lib/types";

export default function ProductsTable() {
  const { products, fetchProducts } = useProductStore();

  if (process.env.NODE_ENV === "development") {
    console.log("Products:", products);
    products.forEach((product, index) => {
      console.log(`Product ${index} createdAt:`, product.createdAt);
    });
  }

  const handleFetchData = useCallback(
    async (
      page: number,
      limit: number,
      filters: { search?: string; createdAt?: { from?: Date; to?: Date } }
    ) => {
      console.log("handleFetchData called:", { page, limit, filters });
      try {
        const response = await fetchProducts({
          page,
          limit,
          search: filters.search,
          from: filters.createdAt?.from
            ? filters.createdAt.from.toISOString()
            : undefined,
          to: filters.createdAt?.to
            ? filters.createdAt.to.toISOString()
            : undefined,
        });
        console.log("handleFetchData response:", response);
        return response;
      } catch (error) {
        console.error("handleFetchData error:", error);
        return { items: [], totalItems: 0, totalPages: 1 };
      }
    },
    [fetchProducts]
  );

  const columns = [
    {
      key: "image",
      header: "Image",
      isImage: true,
      render: (product: Product) => (
        <span className="truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>
      ),
    },
    {
      key: "_id",
      header: "Product ID",
      hiddenOnMobile: true,
    },
    {
      key: "sku",
      header: "SKU",
      hiddenOnMobile: true,
    },
    {
      key: "price",
      header: "Price",
      render: (product: Product) => `$${product.price.toLocaleString()}`,
    },
    {
      key: "stock",
      header: "Stock",
    },
    {
      key: "createdAt",
      header: "Added On",
      hiddenOnMobile: true,
      render: (product: Product) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `Rendering createdAt for ${product._id}:`,
            product.createdAt
          );
        }
        const date = new Date(product.createdAt);
        return isValid(date) ? format(date, "LLL dd, y") : "Invalid Date";
      },
    },
  ];

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
