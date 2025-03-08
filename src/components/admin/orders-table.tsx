"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useOrderStore } from "@/store/order-store";

export default function OrdersTable() {
  const { orders, fetchOrders, cancelOrder } = useOrderStore();
  const { isAdmin } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("OrdersTable useEffect - isAdmin:", isAdmin);
    const loadOrders = async () => {
      if (isAdmin) {
        await fetchOrders();
      }
      setLoading(false);
    };
    loadOrders();
  }, [fetchOrders, isAdmin]);

  if (loading) return <div className="text-center">Loading orders...</div>;
  if (!isAdmin) return <div className="text-center">Unauthorized</div>;

  console.log("Rendering orders:", orders);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center">No orders found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user.name || "Unknown"}</TableCell>
                <TableCell>{order.products.length} items</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {order.status !== "Cancelled" && (
                        <DropdownMenuItem
                          onClick={() => cancelOrder(order._id)}
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
