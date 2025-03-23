/* eslint-disable */
"use client";

import { OrdersDataTable } from "../Data-Table/new-orders-table";
import { useOrdersTableLogic } from "./use-order-table-logic";

export default function OrdersTable() {
  const { orders, handleStatusChange, handleFetchData } = useOrdersTableLogic();
  console.log(
    "Orders passed to OrdersDataTable:",
    orders.map((o) => ({ id: o._id, status: o.status }))
  );

  return (
    <OrdersDataTable
      title="Orders"
      data={orders}
      handleStatusChange={handleStatusChange}
      fetchData={handleFetchData}
      initialPage={1}
      initialLimit={10}
    />
  );
}
