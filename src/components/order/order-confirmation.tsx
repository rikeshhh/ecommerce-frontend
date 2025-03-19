/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { DataTable } from "@/components/admin/Data-Table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  isImage?: boolean;
}

interface Order {
  _id: string;
  products: {
    product: { _id: string; name: string; price: number } | null;
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error("No order ID provided.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please log in to view order details.");
          setLoading(false);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const columns: Column<OrderItem>[] = [
    { key: "name", header: "Product Name" },
    { key: "quantity", header: "Quantity" },
    {
      key: "price",
      header: "Price",
      render: (item) => (
        <span className="text-indigo-600 font-medium">
          रु {item.price.toFixed(2)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (item) => (
        <span className="text-indigo-600 font-medium">
          रु {item.total.toFixed(2)}
        </span>
      ),
    },
  ];

  const orderItems: OrderItem[] =
    order?.products?.map((item, index) => ({
      id: item.product?._id || `unknown-${index}`,
      name: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      price: item.product?.price || 0,
      total: (item.product?.price || 0) * item.quantity,
    })) || [];

  const fetchData = async (page: number, limit: number, filters: any) => {
    console.log(page + limit + filters);
    return {
      items: orderItems,
      totalItems: orderItems.length,
      totalPages: 1,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          <Package className="w-6 h-6 text-green-500" />
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <Package className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-4 text-lg">No order found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-8">
          <Package className="w-16 h-16 mx-auto text-green-500 animate-bounce" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-4">
            Order Confirmed!
          </h1>
          <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 mt-2">
            Thank you for your purchase. Here’s everything you need to know
            about your order.
          </p>
        </div>

        <Card className="shadow-lg border-none rounded-xl bg-white dark:bg-gray-950">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </p>
                <p className="text-lg font-semibold">{order._id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <Badge
                  variant={order.status === "Pending" ? "secondary" : "default"}
                  className="text-sm"
                >
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </p>
                <p className="text-lg font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  रु {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Shipping Location
              </h3>
              {order.location ? (
                <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p>{order.location.address}</p>
                  <p>
                    {order.location.city}, {order.location.state}{" "}
                    {order.location.postalCode}
                  </p>
                  <p className="font-medium">{order.location.country}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No shipping location provided.
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                Items Purchased
              </h3>
              <DataTable
                title="Order Items"
                data={orderItems}
                columns={columns}
                fetchData={fetchData}
                initialPage={1}
                initialLimit={10}
                orderConfirmation={true}
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Want to track this order? Visit your{" "}
            <a
              href="/user/order-history"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Order History
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
