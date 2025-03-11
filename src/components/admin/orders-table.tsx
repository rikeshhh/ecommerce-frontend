"use client";

import { useEffect } from "react";
import { useOrderStore } from "@/store/order-store";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { DataTable } from "@/components/admin/data-table";
import type { Order } from "@/store/order-store";

export default function OrdersTable() {
  const { orders, fetchOrders, updateOrder, loading } = useOrderStore();

  useEffect(() => {
    fetchOrders(1, 10);
  }, [fetchOrders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrder(orderId, newStatus);
  };

  const columns = [
    { key: "_id", header: "Order ID" },
    {
      key: "user.name",
      header: "Customer",
      render: (order: Order) => order.customerName || "Unknown",
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (order: Order) => `$${order.totalAmount.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (order: Order) => (
        <Select
          value={order.status}
          onValueChange={(value) => handleStatusChange(order._id, value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge
                variant={
                  order.status === "Processing"
                    ? "default"
                    : order.status === "Placed"
                    ? "secondary"
                    : order.status === "Shipped"
                    ? "outline"
                    : order.status === "Delivered"
                    ? "default"
                    : "destructive"
                }
              >
                {order.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Placed">Placed</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (order: Order) => format(new Date(order.createdAt), "LLL dd, y"),
    },
  ];

  return (
    <DataTable
      title="Orders"
      data={orders}
      columns={columns}
      fetchData={fetchOrders}
      loading={loading}
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
    />
  );
}
