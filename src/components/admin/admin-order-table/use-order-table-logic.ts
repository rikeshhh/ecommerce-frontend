/* eslint-disable */

"use client";

import { useCallback } from "react";
import { useOrderStore } from "@/store/order-store";

export function useOrdersTableLogic() {
  const { orders = [], fetchOrders, updateOrder } = useOrderStore();

  if (process.env.NODE_ENV === "development") {
    console.log("Orders:", orders);
  }

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: string) => {
      updateOrder(orderId, newStatus);
    },
    [updateOrder]
  );

  const handleFetchData = useCallback(
    async (
      page: number,
      limit: number,
      filters: { search?: string; status?: string; [key: string]: any }
    ) => {
      console.log("handleFetchData called:", { page, limit, filters });
      const response = await fetchOrders(page, limit, filters);
      console.log("handleFetchData response:", response);
      return response;
    },
    [fetchOrders]
  );

  return {
    orders,
    handleStatusChange,
    handleFetchData,
  };
}
