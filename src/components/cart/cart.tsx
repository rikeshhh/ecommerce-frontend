"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "1",
      name: "Product 1",
      price: 49.99,
      image: "/placeholder-image.png",
      quantity: 1,
    },
    {
      id: "2",
      name: "Product 2",
      price: 29.99,
      image: "/placeholder-image.png",
      quantity: 2,
    },
  ]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Card className="max-w-3xl mx-auto my-6 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">🛒 Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="flex items-center p-4 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div className="flex-1 pl-4">
                  <p className="font-medium text-lg">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    className="w-16 text-center"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
        <Separator className="my-6" />
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>

      {cart.length > 0 && (
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full text-lg py-3">
                Proceed to Checkout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-6 space-y-4">
              <h2 className="text-xl font-semibold">Confirm Checkout</h2>
              <p className="text-gray-500 text-sm">
                Your total is <strong>${totalPrice.toFixed(2)}</strong>. Are you
                sure you want to proceed?
              </p>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Confirm Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      )}
    </Card>
  );
}
