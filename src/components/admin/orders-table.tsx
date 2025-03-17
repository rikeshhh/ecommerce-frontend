/* eslint-disable */
"use client";

import { useCallback } from "react";
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
import { useOrderStore, type Order } from "@/store/order-store";

export default function OrdersTable() {
  const { orders = [], fetchOrders, updateOrder } = useOrderStore();
  if (process.env.NODE_ENV === "development") {
    console.log("Orders:", orders);
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrder(orderId, newStatus);
  };

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

  const columns = [
    { key: "_id", header: "Order ID", hiddenOnMobile: true },
    {
      key: "customerName",
      header: "Customer",
      render: (order: Order) => order.customerName || "Unknown",
    },
    {
      key: "products",
      header: "Products",
      render: (order: Order) => (
        <div className="space-y-1 sm:space-y-2">
          {order.products.slice(0, 2).map((p) => (
            <div key={p._id} className="flex items-center gap-2">
              {p.product ? (
                <>
                  <img
                    src={normalizeImageUrl(p.image || p.product?.image || "")}
                    alt={p.product.name || "Unknown Product"}
                    className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded"
                  />
                  <span className="text-xs sm:text-sm">
                    {p.product.name || "Unknown"} (x{p.quantity})
                  </span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">
                  Product Not Found (x{p.quantity})
                </span>
              )}
            </div>
          ))}
          {order.products.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{order.products.length - 2} more
            </span>
          )}
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
          <SelectTrigger className="w-[100px] sm:w-[120px] h-8 text-xs sm:text-sm">
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
      hiddenOnMobile: true,
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
