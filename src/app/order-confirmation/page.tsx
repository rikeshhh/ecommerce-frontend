"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Package } from "lucide-react";

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
        console.log("Fetching order from:", url);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <div className="max-w-3xl mx-auto p-6">
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
        <ul className="space-y-2">
          {order.products.map((item) => (
            <li
              key={item.product?._id || item.quantity}
              className="flex justify-between"
            >
              <span>
                {item.product
                  ? `${item.product.name} (x${item.quantity})`
                  : `Unknown Product (x${item.quantity})`}
              </span>
              <span>
                {item.product
                  ? `$${(item.product.price * item.quantity).toFixed(2)}`
                  : "Price unavailable"}
              </span>
            </li>
          ))}
        </ul>
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
