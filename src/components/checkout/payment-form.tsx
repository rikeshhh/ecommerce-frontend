"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";

interface PaymentFormProps {
  totalPrice: number;
  promoApplied: { code: string; discount: number } | null;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  setDialogOpen: (open: boolean) => void;
  selectedItems: string[];
}

export function PaymentForm({
  totalPrice,
  promoApplied,
  isProcessing,
  setIsProcessing,
  setDialogOpen,
  selectedItems,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearSelectedItems } = useCartStore(); 
  const { user } = useUserStore();
  const router = useRouter();

  const selectedCart = cart.filter((item) => selectedItems.includes(item._id));

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/auth/login?returnUrl=/checkout");
      return;
    }

    if (!user.location) {
      toast.error("Please add a shipping address");
      setDialogOpen(true);
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Cart total must be greater than zero");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) throw new Error(error.message);

      const orderData = {
        products: selectedCart.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),
        totalAmount: Number(totalPrice),
        paymentMethodId: paymentMethod!.id,
        location: user.location,
        promoCode: promoApplied?.code,
      };

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

      if (response.data.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );
        if (confirmError) throw new Error(confirmError.message);
        clearSelectedItems(); 
        toast.success("Your order has been successful!");
        router.push("/main/cart?paymentSuccess=true"); 
      } else {
        clearSelectedItems(); 
        toast.success("Your order has been successfully processed!");
        router.push("/main/cart?paymentSuccess=true");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      if (axios.isAxiosError(error)) {
        toast.error("Order Failed", {
          description:
            error.code === "ERR_NETWORK"
              ? "Cannot connect to the server."
              : error.response?.data?.message || "Please try again later",
        });
      } else {
        toast.error("Unexpected Error", {
          description: (error as Error).message || "Something went wrong",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Payment Details</h2>
      <div className="border p-2 rounded">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
        onClick={handlePlaceOrder}
        disabled={isProcessing || selectedCart.length === 0}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}
