"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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

interface CartSummaryProps {
  selectedTotalPrice: number;
  selectedItemCount: number;
  onCheckout: () => void;
}

export function CartSummary({
  selectedTotalPrice,
  selectedItemCount,
  onCheckout,
}: CartSummaryProps) {
  return (
    <>
      <Separator className="my-4 sm:my-6" />
      <div className="flex flex-col items-end p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between w-full mb-4 text-base sm:text-lg font-medium gap-2 sm:gap-0">
          <span>Subtotal (Selected Items):</span>
          <span className="text-lg sm:text-xl">
            {selectedTotalPrice.toFixed(2)}
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
                <Badge variant="secondary">{selectedItemCount} items</Badge>.
                Total:{" "}
                <span className="font-medium">
                  <strong>NPR</strong> {selectedTotalPrice.toFixed(2)}
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
                onClick={onCheckout}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
