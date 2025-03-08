"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { OrderSchema } from "@/lib/schema/zod-schema";

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  console.log(localStorage.getItem("authToken"));
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/auth/login?returnUrl=/checkout");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const orderData = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),
        totalAmount: Number(totalPrice),
      };

      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Token:", token);
      console.log("Cart:", JSON.stringify(cart, null, 2));
      console.log("Order data sent:", orderData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      clearCart();
      toast.success("Your order has been successfully placed!");
      router.push(`/order-confirmation?orderId=${response.data._id}`);
    } catch (error) {
      console.error("Order placement failed:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          toast.error("Network Error", {
            description: "Cannot connect to the server. Is it running?",
          });
        } else {
          toast.error("Order Failed", {
            description:
              error.response?.data?.message || "Please try again later.",
          });
        }
      } else {
        toast.error("Unexpected Error", {
          description: (error as Error).message || "Something went wrong.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between py-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <p className="text-muted-foreground">
          Add your shipping form here (e.g., address, method).
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p className="text-muted-foreground">
          Add your payment form here (e.g., card details).
        </p>
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handlePlaceOrder}
        disabled={isProcessing || cart.length === 0}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}
