"use client";

import { login, logout } from "@/lib/api/auth-api";
import { User } from "@/lib/schema/zod-schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: (token: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isAdmin: false,

      fetchUserData: async (token: string) => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({
            user: response.data,
            isLoggedIn: true,
            isAdmin: response.data.isAdmin || false,
          });
        } catch (error) {
          console.error("Fetch user error:", error);
          set({ user: null, isLoggedIn: false, isAdmin: false });
          localStorage.removeItem("authToken");
        }
      },

      login: async (credentials: { email: string; password: string }) => {
        try {
          const loginResponse = await login(credentials);
          const token = loginResponse.token;
          if (!token) throw new Error("No token received from login");
          localStorage.setItem("authToken", token);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          set({
            user: response.data,
            isLoggedIn: true,
            isAdmin: response.data.isAdmin || false,
          });
        } catch (error) {
          console.error("Login error:", error);
          set({ user: null, isLoggedIn: false, isAdmin: false });
          localStorage.removeItem("authToken");
          throw error;
        }
      },

      logout: async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            await logout();
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
        set({ user: null, isLoggedIn: false, isAdmin: false });
        localStorage.removeItem("authToken");
      },

      initialize: async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
          await get().fetchUserData(token);
        }
      },
    }),
    {
      name: "user-storage",
    }
  )
);
