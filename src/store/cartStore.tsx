"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  selectedItems: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleItemSelection: (id: string) => void;
  clearSelectedItems: (itemsToClear?: string[]) => void; 
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      selectedItems: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item._id === product._id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
          selectedItems: state.selectedItems.filter((itemId) => itemId !== id),
        })),
      updateQuantity: (id, delta) =>
        set((state) => {
          const updatedCart = state.cart
            .map((item) =>
              item._id === id
                ? { ...item, quantity: item.quantity + delta }
                : item
            )
            .filter((item) => item.quantity > 0);
          return {
            cart: updatedCart,
            selectedItems: state.selectedItems.filter((itemId) =>
              updatedCart.some((item) => item._id === itemId)
            ),
          };
        }),
      toggleItemSelection: (id) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(id);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((itemId) => itemId !== id)
              : [...state.selectedItems, id],
          };
        }),
      clearSelectedItems: (itemsToClear?: string[]) =>
        set((state) => {
        
          const idsToRemove = itemsToClear || state.selectedItems;
          return {
            cart: state.cart.filter((item) => !idsToRemove.includes(item._id)),
            selectedItems: state.selectedItems.filter(
              (itemId) => !idsToRemove.includes(itemId)
            ),
          };
        }),
      clearCart: () =>
        set(() => {
          console.log("Clearing cart...");
          return { cart: [], selectedItems: [] };
        }),
    }),
    { name: "cart-storage" }
  )
);
