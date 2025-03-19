"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="text-center py-8 sm:py-12">
      <ShoppingCart className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-gray-400 mb-4" />
      <p className="text-base sm:text-lg text-gray-600 mb-4">
        Your cart is empty. Add some items to get started!
      </p>
      <Link href="/main/product-listing">
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md text-sm sm:text-base"
        >
          Shop Now
        </Button>
      </Link>
    </div>
  );
}
