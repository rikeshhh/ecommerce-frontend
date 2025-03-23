"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, CartItem } from "@/lib/types/cart-type";
import { addToCart, getCart, removeFromCart } from "@/lib/api/cart-api";
import { toast } from "sonner";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      selectedItems: [],

      initializeCart: async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        try {
          const response = await getCart(token);
          set({ cart: response.cart });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load cart";
          toast.error("Error loading cart", { description: errorMessage });
        }
      },

      addToCart: async (product: CartItem) => {
        const token = localStorage.getItem("authToken");

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
        });

        if (token) {
          try {
            const cartItem = { ...product, quantity: 1 };
            const response = await addToCart(cartItem, token);
            set({ cart: response.cart });
            toast.success("Added to cart");
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to add to cart";
            toast.error("Error syncing cart", { description: errorMessage });
          }
        }
      },

      removeFromCart: async (id: string) => {
        const token = localStorage.getItem("authToken");

        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
          selectedItems: state.selectedItems.filter((itemId) => itemId !== id),
        }));

        if (token) {
          try {
            const response = await removeFromCart(id, token);
            set({ cart: response.cart });
            toast.success("Removed from cart");
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to remove from cart";
            toast.error("Error syncing cart", { description: errorMessage });
          }
        }
      },

      updateQuantity: (id: string, delta: number) =>
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

      toggleItemSelection: (id: string) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(id);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((itemId) => itemId !== id)
              : [...state.selectedItems, id],
          };
        }),

      clearSelectedItems: async (itemsToClear?: string[]) => {
        const token = localStorage.getItem("authToken");
        const idsToRemove = itemsToClear || get().selectedItems;

        set((state) => ({
          cart: state.cart.filter((item) => !idsToRemove.includes(item._id)),
          selectedItems: state.selectedItems.filter(
            (itemId) => !idsToRemove.includes(itemId)
          ),
        }));

        if (token && idsToRemove.length > 0) {
          try {
            await Promise.all(
              idsToRemove.map((id) => removeFromCart(id, token))
            );
            const response = await getCart(token);
            set({ cart: response.cart });
            toast.success("Selected items cleared");
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to clear items";
            toast.error("Error syncing cart", { description: errorMessage });
          }
        }
      },

      clearCart: async () => {
        set({ cart: [], selectedItems: [] });
        toast.success("Cart cleared");
      },
    }),
    { name: "cart-storage" }
  )
);
