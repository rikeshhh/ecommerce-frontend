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
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (id: string, delta: number) => {
    updateQuantity(id, delta);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <Card className="max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/50 py-6">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Your Shopping Cart
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-lg text-muted-foreground">
                Your cart is empty. Start shopping!
              </p>
              <Button variant="outline" className="mt-4">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <Card
                  key={item._id}
                  className="group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image || "/placeholder-image.png"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 px-6">
                    <p className="text-xl font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        (${item.price.toFixed(2)} × {item.quantity})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full hover:bg-muted"
                        onClick={() => handleQuantityChange(item._id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 text-center font-medium text-gray-700">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full hover:bg-muted"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {cart.length > 0 && (
          <>
            <Separator className="my-6" />
            <CardFooter className="flex flex-col items-end p-6 bg-muted/20">
              <div className="flex justify-between w-full mb-6 text-lg font-semibold">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-2xl text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-lg px-8"
                  >
                    Proceed to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-6 rounded-xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Confirm Your Order
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      You’re about to checkout with{" "}
                      <Badge variant="secondary">{cart.length} items</Badge>.
                      Your total is{" "}
                      <span className="font-semibold text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                      . Ready to proceed?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" className="rounded-lg">
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      onClick={() => console.log("Payment confirmed!")}
                    >
                      Confirm Payment
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
