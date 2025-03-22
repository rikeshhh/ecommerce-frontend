"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "./userStore";
import { FavoritesState } from "@/lib/types/favourite-prod-type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,
      error: undefined,
      publicUserId: null,

      toggleFavorite: async (productId: string) => {
        const { user, isLoggedIn } = useUserStore.getState();
        const token = localStorage.getItem("authToken");
        set({ loading: true, error: undefined });

        if (isLoggedIn && user && token) {
          try {
            const isFavorited = get().favorites.includes(productId);
            if (isFavorited) {
              await axios.delete(`${API_URL}/api/favorites/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              set({
                favorites: get().favorites.filter((id) => id !== productId),
                loading: false,
              });
              toast.success("Removed from favorites");
              useUserStore.setState({
                user: { ...user, favorites: get().favorites },
              });
            } else {
              const response = await axios.post(
                `${API_URL}/api/favorites`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              set({ favorites: response.data.favorites, loading: false });
              toast.success("Added to favorites");
              useUserStore.setState({
                user: { ...user, favorites: response.data.favorites },
              });
            }
          } catch (error) {
            set({
              loading: false,
              error: `Failed to update favorites ${error}`,
            });
            toast.error("Failed to update favorites");
          }
        } else {
          const publicUserId = get().publicUserId || uuidv4();
          set({ publicUserId });

          try {
            const isFavorited = get().favorites.includes(productId);
            if (isFavorited) {
              const response = await axios.delete(
                `${API_URL}/api/favorites/${productId}`,
                {
                  data: { userId: publicUserId },
                }
              );
              set({ favorites: response.data.favorites, loading: false });
              toast.success("Removed from favorites (public)");
            } else {
              const response = await axios.post(`${API_URL}/api/favorites`, {
                productId,
                userId: publicUserId,
              });
              set({ favorites: response.data.favorites, loading: false });
              toast.success("Added to favorites (public)");
            }
          } catch (error) {
            set({
              loading: false,
              error: "Failed to update favorites" + error,
            });
            toast.error("Failed to update favorites");
          }
        }
      },

      fetchFavorites: async () => {
        const { isLoggedIn, user } = useUserStore.getState();
        const token = localStorage.getItem("authToken");
        set({ loading: true, error: undefined });

        if (isLoggedIn && user && token) {
          try {
            const response = await axios.get(`${API_URL}/api/favorites`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            set({
              favorites: response.data.favorites.map(
                (p: { _id: string }) => p._id
              ),
              loading: false,
            });
            useUserStore.setState({
              user: {
                ...user,
                favorites: response.data.favorites.map(
                  (p: { _id: string }) => p._id
                ),
              },
            });
          } catch (error) {
            set({
              loading: false,
              error: `Failed to fetch favorites ${error}`,
            });
          }
        } else {
          const publicUserId = get().publicUserId || uuidv4();
          set({ publicUserId });
          try {
            const response = await axios.get(`${API_URL}/api/favorites`, {
              params: { userId: publicUserId },
            });
            set({
              favorites: response.data.favorites.map(
                (p: { _id: string }) => p._id
              ),
              loading: false,
            });
          } catch (error) {
            set({
              loading: false,
              error: `Failed to fetch favorites ${error}`,
            });
          }
        }
      },

      initialize: async () => {
        const { isLoggedIn } = useUserStore.getState();
        if (isLoggedIn) {
          await get().fetchFavorites();
        } else {
          const publicUserId = get().publicUserId || uuidv4();
          set({ publicUserId });
          await get().fetchFavorites();
        }
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
