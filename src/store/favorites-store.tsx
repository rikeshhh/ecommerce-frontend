"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "./userStore";
import { FavoritesState } from "@/lib/types/favourite-prod-type";
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from "@/lib/api/favourite-api";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,
      error: undefined,
      publicUserId: null,

      toggleFavorite: async (productId: string) => {
        const { user, isLoggedIn } = useUserStore.getState();
        set({ loading: true, error: undefined });

        try {
          const isFavorited = get().favorites.includes(productId);
          if (isLoggedIn && user) {
            let updatedFavorites: string[];
            if (isFavorited) {
              updatedFavorites = await removeFavorite(productId);
              toast.success("Removed from favorites");
            } else {
              updatedFavorites = await addFavorite(productId);
              toast.success("Added to favorites");
            }
            set({ favorites: updatedFavorites, loading: false });
            useUserStore.setState({
              user: { ...user, favorites: updatedFavorites },
            });
          } else {
            const publicUserId = get().publicUserId || uuidv4();
            set({ publicUserId });

            let updatedFavorites: string[];
            if (isFavorited) {
              updatedFavorites = await removeFavorite(productId, publicUserId);
              toast.success("Removed from favorites (public)");
            } else {
              updatedFavorites = await addFavorite(productId, publicUserId);
              toast.success("Added to favorites (public)");
            }
            set({ favorites: updatedFavorites, loading: false });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update favorites";
          set({ loading: false, error: errorMessage });
          toast.error("Failed to update favorites", {
            description: errorMessage,
          });
        }
      },

      fetchFavorites: async () => {
        const { isLoggedIn, user } = useUserStore.getState();
        set({ loading: true, error: undefined });

        try {
          const favorites =
            isLoggedIn && user
              ? await fetchFavorites()
              : await fetchFavorites(get().publicUserId || uuidv4());

          set({ favorites, loading: false });
          if (isLoggedIn && user) {
            useUserStore.setState({
              user: { ...user, favorites },
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch favorites";
          set({ loading: false, error: errorMessage });
          toast.error("Failed to fetch favorites", {
            description: errorMessage,
          });
        }
      },

      initialize: async () => {
        const { isLoggedIn } = useUserStore.getState();
        if (!isLoggedIn) {
          const publicUserId = get().publicUserId || uuidv4();
          set({ publicUserId });
        }
        await get().fetchFavorites();
      },
    }),
    {
      name: "favorites-storage",
      partialize: (state) => ({
        favorites: state.favorites,
        publicUserId: state.publicUserId,
      }),
    }
  )
);
