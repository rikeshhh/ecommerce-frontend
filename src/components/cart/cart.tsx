"use client";

import React from "react";
import Image from "next/image";
import { Trash, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { isLoggedIn } = useUserStore();
  const router = useRouter();

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

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (isLoggedIn) {
      router.push("/user/checkout");
    } else {
      router.push("/auth/login?returnUrl=/main/cart");
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6">
      <Card className="border-none shadow-md rounded-lg bg-white dark:bg-gray-900 ">
        <CardHeader className="py-4 sm:py-6 px-4 sm:px-6 border-b border-gray-200">
          <CardTitle className="text-2xl sm:text-3xl font-semibold  flex items-center gap-2 sm:gap-3">
            <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 dark:text-white" />
            Shopping Cart
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {cart.length === 0 ? (
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
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className={cn(
                    "flex flex-wrap items-center  p-3 sm:p-4 border border-gray-200 rounded-lg  transition-colors duration-200"
                  )}
                >
                  <div className="relative w-full sm:w-20 h-24 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || "/placeholder-image.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, 80px"
                    />
                  </div>
                  <div className="flex-1 px-3 sm:px-4 text-center md:text-left">
                    <p className="text-base sm:text-lg font-medium  line-clamp-1">
                      {item.name}
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 sm:gap-2 mt-1">
                      <span className="text-sm sm:text-base font-semibold ">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        (${item.price.toFixed(2)} × {item.quantity})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 md:mt-0">
                    <div className="flex items-center gap-0.5 sm:gap-1 border border-gray-300 rounded-md p-0.5 sm:p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 sm:w-8 h-7 sm:h-8 text-gray-600 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item._id, -1)}
                      >
                        <Minus className="w-3 sm:w-4 h-3 sm:h-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center font-medium  text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 sm:w-8 h-7 sm:h-8  hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 w-7 sm:w-8 h-7 sm:h-8"
                    >
                      <Trash className="w-3 sm:w-4 h-3 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {cart.length > 0 && (
          <>
            <Separator className="my-4 sm:my-6" />
            <CardFooter className="flex flex-col items-end p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between w-full mb-4 text-base sm:text-lg font-medium gap-2 sm:gap-0">
                <span className="">Subtotal:</span>
                <span className="text-lg sm:text-xl ">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 sm:px-6 text-sm sm:text-base"
                  >
                    Proceed to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-6 rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                      Confirm Order
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 text-sm sm:text-base">
                      You are about to checkout with{" "}
                      <Badge variant="secondary">{cart.length} items</Badge>.
                      Total:{" "}
                      <span className="font-medium">
                        ${totalPrice.toFixed(2)}
                      </span>
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                    <Button
                      variant="outline"
                      className="rounded-md text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm sm:text-base"
                      onClick={handleCheckout}
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
