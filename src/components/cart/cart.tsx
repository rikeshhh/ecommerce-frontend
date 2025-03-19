"use client";

import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { EmptyCart } from "./empty-cart";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

export default function Cart() {
  const {
    cart,
    selectedItems,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    clearSelectedItems,
  } = useCartStore();
  const { isLoggedIn } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentSuccess = searchParams.get("paymentSuccess");
    if (paymentSuccess === "true" && selectedItems.length > 0) {
      clearSelectedItems();
    }
  }, [searchParams, selectedItems, clearSelectedItems]);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find((item) => item._id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const selectedTotalPrice = cart
    .filter((item) => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }
    if (isLoggedIn) {
      const selectedIds = encodeURIComponent(JSON.stringify(selectedItems));
      router.push(`/user/checkout?selectedItems=${selectedIds}`);
    } else {
      router.push("/auth/login?returnUrl=/main/cart");
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6">
      <Card className="border-none shadow-md rounded-lg bg-white dark:bg-gray-900">
        <CardHeader className="py-4 sm:py-6 px-4 sm:px-6 border-b border-gray-200">
          <CardTitle className="text-2xl sm:text-3xl font-semibold flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 dark:text-white" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  isSelected={selectedItems.includes(item._id)}
                  onToggleSelection={toggleItemSelection}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </CardContent>
        {cart.length > 0 && (
          <CartSummary
            selectedTotalPrice={selectedTotalPrice}
            selectedItemCount={selectedItems.length}
            onCheckout={handleCheckout}
          />
        )}
      </Card>
    </div>
  );
}
