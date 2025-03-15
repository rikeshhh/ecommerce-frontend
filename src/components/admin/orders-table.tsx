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
import { normalizeImageUrl } from "@/lib/utils";
import type { Order } from "@/store/order-store";

export default function OrdersTable() {
  const { orders, fetchOrders, updateOrder, loading } = useOrderStore();
  console.log(orders, "orders");

  useEffect(() => {
    fetchOrders(1, 10);
  }, [fetchOrders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrder(orderId, newStatus);
  };

  const handleFetchData = async (page: number, limit: number, filters: any) => {
    try {
      const response = await fetchOrders(page, limit, {
        search: filters.search || "",
        status: filters.status || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const columns = [
    { key: "_id", header: "Order ID" },
    {
      key: "user.name",
      header: "Customer",
      render: (order: Order) => order.customerName || "Unknown",
    },
    {
      key: "products",
      header: "Products",
      isImage: true,
      render: (order: Order) => (
        <div className="space-y-2">
          {order.products.map((p) => (
            <div key={p._id} className="flex items-center gap-2">
              {p.product ? (
                <>
                  <img
                    src={normalizeImageUrl(p.product.image)}
                    alt={p.product.name || "Unknown Product"}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span>
                    {p.product.name || "Unknown"} (Qty: {p.quantity})
                  </span>
                </>
              ) : (
                <span>Product Not Found (Qty: {p.quantity})</span>
              )}
            </div>
          ))}
        </div>
      ),
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
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Placed">Placed</SelectItem>
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
