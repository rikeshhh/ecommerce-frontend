"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
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
    {
      key: "name",
      header: "Product Name",
    },
    {
      key: "quantity",
      header: "Quantity",
    },
    {
      key: "price",
      header: "Price",
      render: (item) => `$${item.price.toFixed(2)}`,
    },
    {
      key: "total",
      header: "Total",
      render: (item) => `$${item.total.toFixed(2)}`,
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

  const fetchData = async () => {
    return;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No order found.</p>
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto p-6">
      <div className="text-center mb-6">
        <Package className="w-12 h-12 mx-auto text-green-500" />
        <h1 className="text-3xl font-bold mt-4">Order Confirmed!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Here are the details of your order.
        </p>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
        </p>

        <h3 className="text-lg font-medium mt-4 mb-2">Items</h3>
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

      <div className="text-center mt-6">
        <p className="text-gray-600">
          You can track this order in your{" "}
          <a href="/user/order-history" className="text-blue-500 underline">
            Order History
          </a>
          .
        </p>
      </div>
    </div>
  );
}
