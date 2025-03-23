"use client";

import { addToCart, getCart, removeFromCart } from "@/lib/api/cart-api";
import { CartItem, CartResponse } from "@/lib/types/cart-type";
import { useCartStore } from "@/store/cartStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCart = (token?: string) => {
  const setCart = useCartStore((state) => state.setCart);
  const localCart = useCartStore((state) => state.cart);

  return useQuery({
    queryKey: ["cart", token],
    queryFn: async () => {
      if (!token) {
        return { cart: localCart } as CartResponse;
      }
      return getCart(token);
    },
    onSuccess: (data: CartResponse) => {
      if (token) {
        setCart(data.cart);
      }
    },
    enabled: true,
    initialData: token ? undefined : { cart: localCart },
  });
};

export const useAddToCart = (token?: string) => {
  const queryClient = useQueryClient();
  const addToCartStore = useCartStore((state) => state.addToCart);

  return useMutation({
    mutationFn: (cartData: CartItem) => {
      if (!token) {
        return Promise.resolve({
          cart: [...useCartStore.getState().cart, { ...cartData, quantity: 1 }],
        } as CartResponse);
      }
      return addToCart(cartData, token);
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries(["cart", token]);
      const previousCart = queryClient.getQueryData<CartResponse>([
        "cart",
        token,
      ]);

      addToCartStore(newItem);

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["cart", token], context?.previousCart);
    },
    onSettled: () => {
      if (token) {
        queryClient.invalidateQueries(["cart", token]);
      }
    },
  });
};

export const useRemoveFromCart = (token?: string) => {
  const queryClient = useQueryClient();
  const removeFromCartStore = useCartStore((state) => state.removeFromCart);

  return useMutation({
    mutationFn: (itemId: string) => {
      if (!token) {
        const updatedCart = useCartStore
          .getState()
          .cart.filter((item) => item._id !== itemId);
        return Promise.resolve({ cart: updatedCart } as CartResponse);
      }
      return removeFromCart(itemId, token);
    },
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(["cart", token]);
      const previousCart = queryClient.getQueryData<CartResponse>([
        "cart",
        token,
      ]);

      removeFromCartStore(itemId);

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      queryClient.setQueryData(["cart", token], context?.previousCart);
    },
    onSettled: () => {
      if (token) {
        queryClient.invalidateQueries(["cart", token]);
      }
    },
  });
};
