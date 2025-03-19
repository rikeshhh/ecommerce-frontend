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
  updateQuantity: (id: string, quantity: number) => void;
  toggleItemSelection: (id: string) => void;
  clearSelectedItems: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
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
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      toggleItemSelection: (id) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(id);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((itemId) => itemId !== id)
              : [...state.selectedItems, id],
          };
        }),
      clearSelectedItems: () =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !state.selectedItems.includes(item._id)
          ),
          selectedItems: [],
        })),
      clearCart: () => {
        console.log("Before clearCart, cart:", get().cart);
        set({ cart: [], selectedItems: [] });
        localStorage.removeItem("cart-storage");
        console.log("After clearCart, cart:", get().cart);
      },
    }),
    { name: "cart-storage" }
  )
);
