"use client";

import React from "react";

interface OrderSummaryProps {
  cart: { _id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  promoApplied: { code: string; discount: number } | null;
}

export function OrderSummary({
  cart,
  subtotal,
  discount,
  totalPrice,
  promoApplied,
}: OrderSummaryProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      {cart.map((item) => (
        <div key={item._id} className="flex justify-between py-2">
          <span>
            {item.name} (x{item.quantity})
          </span>
          <span>
            <strong>NPR</strong>
            {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>
            <strong>NPR</strong>
            {subtotal.toFixed(2)}
          </span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoApplied.code}):</span>
            <span>
              -<strong>NPR</strong>
              {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>
            <strong>NPR</strong>
            {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
