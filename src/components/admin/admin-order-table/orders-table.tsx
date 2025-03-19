/* eslint-disable */
"use client";

import { DataTable } from "@/components/admin/Data-Table/data-table";
import { getOrderColumns } from "./orderColumns";
import { useOrdersTableLogic } from "./use-order-table-logic";

export default function OrdersTable() {
  const { orders, handleStatusChange, handleFetchData } = useOrdersTableLogic();

  const columns = getOrderColumns(handleStatusChange);

  return (
    <DataTable
      title="Orders"
      data={orders}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{
        statusOptions: [
          "Placed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
        dateField: "createdAt",
      }}
      initialPage={1}
      initialLimit={10}
    />
  );
}
