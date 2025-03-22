"use client";

import React from "react";
import Image from "next/image";
import { Trash, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/utils";

interface CartItemProps {
  item: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  item,
  isSelected,
  onToggleSelection,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      onRemove(item._id);
    } else {
      onQuantityChange(item._id, delta);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center p-3 sm:p-4 border border-gray-200 rounded-lg transition-colors duration-200"
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelection(item._id)}
        className="mr-2 sm:mr-3"
      />
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
        <p className="text-base sm:text-lg font-medium line-clamp-1">
          {item.name}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 sm:gap-2 mt-1">
          <span className="text-sm sm:text-base font-semibold">
            <strong className="text-indigo-600 dark:text-indigo-400">रु</strong>{" "}
            {(item.price * item.quantity).toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            <strong>रु</strong> ({item.price.toFixed(2)} × {item.quantity})
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 mt-2 md:mt-0">
        <div className="flex items-center gap-0.5 sm:gap-1 border border-gray-300 rounded-md p-0.5 sm:p-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 sm:w-8 h-7 sm:h-8 text-gray-600 hover:bg-gray-100"
            onClick={() => handleQuantityChange(-1)}
          >
            <Minus className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
          <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 sm:w-8 h-7 sm:h-8 hover:bg-gray-100"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item._id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 w-7 sm:w-8 h-7 sm:h-8"
        >
          <Trash className="w-3 sm:w-4 h-3 sm:h-4" />
        </Button>
      </div>
    </div>
  );
}
