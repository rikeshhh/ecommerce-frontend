"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface OrderPayload {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  paymentMethodId: string;
}

const CheckoutForm: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/auth/login?returnUrl=/checkout");
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      toast.error("Stripe not loaded");
      return;
    }

    if (totalPrice <= 0) {
      console.error("Total price is invalid:", totalPrice);
      toast.error("Cart total must be greater than zero");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token)
        throw new Error("No authentication token found. Please log in.");

      const cardElement = elements.getElement(CardElement);
      console.log("CardElement retrieved:", cardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
      });

      if (error) {
        console.error("Stripe createPaymentMethod error:", error);
        throw new Error(error.message);
      }

      console.log("PaymentMethod created:", paymentMethod);
      const orderData: OrderPayload = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),
        totalAmount: Number(totalPrice),
        paymentMethodId: paymentMethod!.id,
      };

      console.log("Sending order data:", orderData);
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
        clearCart();
        console.log("Cart cleared, new state:", useCartStore.getState().cart);
        toast.success("Your order has been successfully placed!");
        router.push(
          `/order-confirmation?orderId=${response.data.paymentIntentId}`
        );
      } else {
        clearCart();
        console.log("Cart cleared, new state:", useCartStore.getState().cart);
        toast.success("Your order has been successfully placed!");
        router.push(`/order-confirmation?orderId=${response.data._id}`);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      if (axios.isAxiosError(error)) {
        toast.error("Order Failed", {
          description:
            error.code === "ERR_NETWORK"
              ? "Cannot connect to the server. Is it running?"
              : error.response?.data?.message || "Please try again later.",
        });
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
        <div className="border p-2 rounded">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
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
};

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
