/* eslint-disable */

"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrder } from "@/lib/api/order-api";
import { toast } from "sonner";

export function useOrdersTableLogic() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page: 1, limit: 10 }],
    queryFn: () => fetchOrders({ page: 1, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  const orders = data?.items || [];

  if (process.env.NODE_ENV === "development") {
    console.log("Orders:", orders);
  }

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrder(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["orders", { page: 1, limit: 10 }],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((order: any) =>
              order._id === variables.id
                ? { ...order, status: variables.status }
                : order
            ),
          };
        }
      );
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      toast.error("Error updating order", { description: errorMessage });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: string) => {
      updateOrderMutation.mutate({ id: orderId, status: newStatus });
    },
    [updateOrderMutation]
  );

  const handleFetchData = useCallback(
    async (
      page: number,
      limit: number,
      filters: { search?: string; status?: string; [key: string]: any }
    ) => {
      console.log("handleFetchData called:", { page, limit, filters });
      const response = await queryClient.fetchQuery({
        queryKey: ["orders", { page, limit, ...filters }],
        queryFn: () =>
          fetchOrders({
            page,
            limit,
            search: filters.search,
            dateFrom: filters.createdAt?.from,
            dateTo: filters.createdAt?.to,
            status: filters.status,
          }),
      });
      console.log("handleFetchData response:", response);
      return response;
    },
    [queryClient]
  );

  return {
    orders,
    handleStatusChange,
    handleFetchData,
  };
}
