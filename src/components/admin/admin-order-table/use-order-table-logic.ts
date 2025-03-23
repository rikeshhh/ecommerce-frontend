/* eslint-disable */

"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrder } from "@/lib/api/order-api";
import { toast } from "sonner";

export function useOrdersTableLogic() {
  const queryClient = useQueryClient();
  const [activeQueryKey, setActiveQueryKey] = useState([
    "orders",
    { page: 1, limit: 10 },
  ]);

  const { data } = useQuery({
    queryKey: activeQueryKey,
    queryFn: () => fetchOrders(activeQueryKey[1]),
  });
  const orders = data?.items || [];

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrder(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(activeQueryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((order: any) =>
            order._id === variables.id
              ? { ...order, status: variables.status }
              : order
          ),
        };
      });
      toast.success("Order updated successfully");
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
    async (page, limit, filters) => {
      console.log("i am called");

      console.log("handleFetchData called:", { page, limit, filters });
      const response = await queryClient.fetchQuery({
        queryKey: ["orders", { page, limit, ...filters }],
        queryFn: () => fetchOrders({ page, limit, ...filters }),
      });
      return response;
    },
    [queryClient]
  );

  return { orders, handleStatusChange, handleFetchData };
}
