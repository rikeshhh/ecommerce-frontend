"use client";

import { OrderSummaryProps } from "@/lib/types/order-summary-type";
import React from "react";

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
            <strong className="text-indigo-600 dark:text-indigo-400">रु</strong>{" "}
            {""}
            {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>
            <strong className="text-indigo-600 dark:text-indigo-400">रु</strong>{" "}
            {subtotal.toFixed(2)}
          </span>
        </div>
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoApplied.code}):</span>
            <span>
              -{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                रु
              </strong>{" "}
              {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>
            <strong className="text-indigo-600 dark:text-indigo-400">रु</strong>{" "}
            {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
