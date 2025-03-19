"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  products: {
    product: { _id: string; name: string; price: number } | null;
    quantity: number;
  }[];
  totalAmount?: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login?returnUrl=/user/order-history");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.orders);
        console.log(response.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load your order history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-50 tracking-tight">
        Your Order History
      </h1>
      {orders.length === 0 ? (
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No orders found yet. Start shopping!
        </p>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {orders.map((order) => (
            <AccordionItem
              key={order._id}
              value={order._id}
              className="border-none"
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <AccordionTrigger className="p-2">
                  <CardHeader className="flex md:flex-row flex-col items-start justify-start md:justify-between w-full">
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Order #{order._id.slice(-6)}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge
                        className={cn(
                          "text-sm font-medium",
                          order.status === "Placed" && "bg-blue-500 text-white",
                          order.status === "Processing" &&
                            "bg-yellow-500 text-black",
                          order.status === "Shipped" &&
                            "bg-purple-500 text-white",
                          order.status === "Delivered" &&
                            "bg-green-500 text-white",
                          order.status === "Cancelled" &&
                            "bg-red-500 text-white"
                        )}
                      >
                        {order.status}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <span>{order?.paymentStatus}</span>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          <strong>Total Amount:</strong> $
                          {order.totalAmount !== undefined
                            ? order.totalAmount.toLocaleString()
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>Order Date:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        {order.location ? (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              <strong>Shipping Location:</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.location.address}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.location.city}, {order.location.state}{" "}
                              {order.location.postalCode}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {order.location.country}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Shipping Location:</strong> Not provided
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/user/order-details/${order._id}`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">Product</TableHead>
                          <TableHead className="text-center">
                            Quantity
                          </TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.products.map((item) => (
                          <TableRow key={item.product?._id || item.quantity}>
                            <TableCell className="text-left">
                              {item.product?.name ?? "Unknown Product"}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              <strong>NPR</strong>
                              {item.product?.price ?? "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default OrderHistory;
