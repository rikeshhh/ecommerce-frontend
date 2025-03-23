"use client";

import { DataTable } from "@/components/admin/Data-Table/data-table";
import { getProductColumns } from "./product-columns";
import { useProductsTableLogic } from "./use-products-table-logic";

export default function ProductsTable() {
  const { products, handleFetchData } = useProductsTableLogic();

  const columns = getProductColumns();

  return (
    <DataTable
      title="Products"
      data={products}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{ dateField: "createdAt" }}
      initialPage={1}
      initialLimit={5}
    />
  );
}
