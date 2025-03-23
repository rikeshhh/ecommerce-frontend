"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api/order-api";
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
import { cn } from "@/lib/utils/utils";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderHistory() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", { page: 1, limit: 100 }],
    queryFn: () => fetchOrders({ page: 1, limit: 100 }),
    enabled: !!authToken,
    onError: (err: unknown) => {
      console.error("Query error:", err);
      toast.error("Failed to load your order history. Please try again.");
      if (err instanceof Error && err.message === "Authentication required") {
        router.push("/auth/login?returnUrl=/user/order-history");
      }
    },
    onSuccess: (data) => {
      console.log("Fetched orders:", data);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-1/2 sm:w-1/3 mb-8 rounded-lg" />
          <div className="space-y-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl sm:h-24" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const orders = data?.items || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <Package className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your Order History
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-xl shadow-lg">
            <Package className="w-16 h-16 mx-auto text-gray-400 animate-bounce" />
            <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              No orders yet—time to treat yourself!
            </p>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 text-sm sm:text-base"
              onClick={() => router.push("/main")}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-6">
            {orders.map((order) => (
              <AccordionItem
                key={order._id}
                value={order._id}
                className="border-none"
              >
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <AccordionTrigger className="p-0 hover:no-underline">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full p-6 bg-gray-50 dark:bg-gray-900">
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Order #{order._id.slice(-6)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <Badge
                          className={cn(
                            "text-sm font-medium px-3 py-1 rounded-full",
                            order.status === "Placed" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                            order.status === "Processing" &&
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            order.status === "Shipped" &&
                              "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                            order.status === "Delivered" &&
                              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                            order.status === "Cancelled" &&
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          )}
                        >
                          {order.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Total Amount:</strong>{" "}
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              रु{" "}
                              {order.totalAmount !== undefined
                                ? order.totalAmount.toLocaleString()
                                : "N/A"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Order Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Payment Status:</strong>{" "}
                            <span
                              className={cn(
                                "font-semibold",
                                order.paymentStatus === "Paid"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              )}
                            >
                              {order.paymentStatus}
                            </span>
                          </p>
                          {order.location ? (
                            <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Shipping Location:
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {order.location.address}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.location.city}, {order.location.state}{" "}
                                {order.location.postalCode}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {order.location.country}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                              Shipping Location: Not provided
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end items-start">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo-600 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900 transition-colors rounded-lg px-4 py-2"
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
                          <TableRow className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <TableHead className="text-left text-gray-700 dark:text-gray-300 font-semibold">
                              Product
                            </TableHead>
                            <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                              Quantity
                            </TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">
                              Price
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.products.map((item) => (
                            <TableRow
                              key={item.product?._id || item.quantity}
                              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <TableCell className="text-left text-gray-800 dark:text-gray-200 font-medium">
                                {item.product?.name ?? "Unknown Product"}
                              </TableCell>
                              <TableCell className="text-center text-gray-600 dark:text-gray-400">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right text-indigo-600 dark:text-indigo-400 font-semibold">
                                रु{" "}
                                {item.product?.price?.toLocaleString() ?? "N/A"}
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
    </div>
  );
}
