"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import axios from "axios";
import { OrderSummary } from "./order-summary";
import { PromoCodeSection } from "./promo-code-section";
import { ShippingInfo } from "./shipping-info";
import { PaymentForm } from "./payment-form";
import { reverseGeocode } from "@/lib/utils/geocode";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function CheckoutForm() {
  const { cart } = useCartStore();
  const { user } = useUserStore();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const selectedItemsParam = searchParams.get("selectedItems");
  const selectedItems = selectedItemsParam
    ? JSON.parse(decodeURIComponent(selectedItemsParam))
    : [];

  const selectedCart = cart.filter((item) => selectedItems.includes(item._id));

  const subtotal = selectedCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = promoApplied ? (subtotal * promoApplied.discount) / 100 : 0;
  const totalPrice = subtotal - discount;

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const liveLocation = await reverseGeocode(latitude, longitude);
          useUserStore.getState().updateLiveLocation(liveLocation);

          const token = localStorage.getItem("authToken");
          if (token) {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
            await axios.put(
              url,
              { location: liveLocation },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } catch (error) {
          console.error("Live location update failed:", error);
          if (axios.isAxiosError(error)) {
            toast.error("Failed to update live location", {
              description:
                error.response?.status === 404
                  ? "Endpoint not found."
                  : error.response?.data?.message || error.message,
            });
          } else {
            toast.error("Geolocation error", {
              description: (error as Error).message,
            });
          }
        }
      },
      (error) => {
        toast.error(`Geolocation error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="md:max-w-4xl w-full mx-auto p-6 container">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <OrderSummary
        cart={selectedCart}
        subtotal={subtotal}
        discount={discount}
        totalPrice={totalPrice}
        promoApplied={promoApplied}
      />
      <PromoCodeSection
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        promoApplied={promoApplied}
        setPromoApplied={setPromoApplied}
        promoError={promoError}
        setPromoError={setPromoError}
        cart={selectedCart}
      />
      <ShippingInfo
        user={user}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
      <PaymentForm
        totalPrice={totalPrice}
        promoApplied={promoApplied}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        setDialogOpen={setDialogOpen}
        selectedItems={selectedItems}
      />
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
