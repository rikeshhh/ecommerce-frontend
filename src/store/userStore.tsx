"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { login, logout } from "@/lib/api/auth-api";
import { User } from "@/lib/schema/zod-schema";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  items: User[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  fetchItems: (page: number, limit: number) => Promise<void>;
  updateUserRole: (id: string, isAdmin: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      const fetchUserData = async (token: string) => {
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
          throw error;
        }
      };

      return {
        user: null,
        isLoggedIn: false,
        isAdmin: false,
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,

        login: async (credentials: { email: string; password: string }) => {
          try {
            const loginResponse = await login(credentials);
            const token = loginResponse.token;
            if (!token) throw new Error("No token received from login");
            localStorage.setItem("authToken", token);
            await fetchUserData(token);
            toast.success("Logged in successfully");
          } catch (error) {
            console.error("Login error:", error);
            set({ user: null, isLoggedIn: false, isAdmin: false });
            localStorage.removeItem("authToken");
            toast.error("Login failed", {
              description: (error as Error).message || "Invalid credentials",
            });
            throw error;
          }
        },

        logout: async () => {
          const token = localStorage.getItem("authToken");
          if (token) {
            try {
              await logout();
              toast.success("Logged out successfully");
            } catch (error) {
              console.error("Logout error:", error);
              toast.error("Logout failed", {
                description: axios.isAxiosError(error)
                  ? error.message
                  : "Something went wrong",
              });
            }
          }
          set({ user: null, isLoggedIn: false, isAdmin: false, items: [] });
          localStorage.removeItem("authToken");
        },

        initialize: async () => {
          const token = localStorage.getItem("authToken");
          if (token) {
            await fetchUserData(token);
          }
        },

        fetchItems: async (page: number, limit: number) => {
          const token = localStorage.getItem("authToken");
          console.log(
            "Fetching users - Token:",
            token,
            "Page:",
            page,
            "Limit:",
            limit
          );
          if (!token) {
            toast.error("Authentication required", {
              description: "Please log in to view users.",
            });
            set({
              items: [],
              totalItems: 0,
              currentPage: 1,
              totalPages: 1,
              limit: 10,
            });
            return;
          }
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
              {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit },
              }
            );
            console.log("Users response data:", response.data);
            set({
              items: response.data.users || [],
              totalItems: response.data.totalUsers || 0,
              currentPage: response.data.currentPage || 1,
              totalPages: response.data.totalPages || 1,
              limit: response.data.limit || 10,
            });
          } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error fetching users", {
              description: axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Unknown error",
            });
            set({
              items: [],
              totalItems: 0,
              currentPage: 1,
              totalPages: 1,
              limit: 10,
            });
          }
        },

        updateUserRole: async (id: string, isAdmin: boolean) => {
          const token = localStorage.getItem("authToken");
          if (!token) {
            toast.error("Authentication required", {
              description: "Please log in to update user roles.",
            });
            return;
          }
          try {
            const response = await axios.patch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
              { isAdmin },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            set((state) => ({
              items: state.items.map((user) =>
                user._id === id
                  ? { ...user, isAdmin: response.data.isAdmin }
                  : user
              ),
            }));
            toast.success("User role updated successfully");
          } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Error updating user role", {
              description: axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Unknown error",
            });
          }
        },

        deleteUser: async (id: string) => {
          const token = localStorage.getItem("authToken");
          console.log("Deleting user with ID:", id);
          if (!token) {
            toast.error("Authentication required", {
              description: "Please log in to delete users.",
            });
            return;
          }
          try {
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            set((state) => ({
              items: state.items.filter((user) => user._id !== id),
              totalItems: state.totalItems - 1,
              totalPages: Math.ceil((state.totalItems - 1) / state.limit),
            }));
            toast.success("User deleted successfully");
          } catch (error) {
            console.error("Error deleting user:", error);
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              toast.error("User not found", {
                description: "The user you tried to delete does not exist.",
              });
            } else {
              toast.error("Error deleting user", {
                description: axios.isAxiosError(error)
                  ? error.response?.data?.message || error.message
                  : "Unknown error",
              });
            }
          }
        },
      };
    },
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
