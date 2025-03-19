"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

interface PromoCodeSectionProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: { code: string; discount: number } | null;
  setPromoApplied: (promo: { code: string; discount: number } | null) => void;
  promoError: string | null;
  setPromoError: (error: string | null) => void;
  cart: { _id: string; quantity: number }[];
}

export function PromoCodeSection({
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  promoError,
  setPromoError,
  cart,
}: PromoCodeSectionProps) {
  const handleApplyPromo = async () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promo/validate`,
        {
          code: promoCode,
          orders: [
            {
              products: cart.map((item) => ({
                product: item._id,
                quantity: item.quantity,
              })),
            },
          ],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPromoApplied({
          code: promoCode,
          discount: response.data.promo.discount,
        });
        setPromoError(null);
        toast.success(`Promo code "${promoCode}" applied!`);
      } else {
        setPromoError(response.data.message || "Invalid promo code");
      }
    } catch (error) {
      setPromoError("Failed to validate promo code");
      console.error("Promo validation error:", error);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError(null);
    toast.info("Promo code removed");
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Promo Code</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code (e.g., SAVE10)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={!!promoApplied}
          className="flex-1"
        />
        {promoApplied ? (
          <Button variant="outline" onClick={handleRemovePromo}>
            Remove
          </Button>
        ) : (
          <Button onClick={handleApplyPromo}>Apply</Button>
        )}
      </div>
      {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
    </div>
  );
}
