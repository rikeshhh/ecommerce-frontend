"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";
import { login, logout } from "@/lib/api/auth-api";
import { LocationFormValues, User } from "@/lib/schema/zod-schema";

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  items: User[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  setGoogleLogin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  fetchItems: (
    page: number,
    limit: number,
    filters?: {
      search?: string;
      createdAt?: { from?: string; to?: string };
      role?: string;
    }
  ) => Promise<void>;
  updateUserRole: (id: string, isAdmin: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateLocation: (location: LocationFormValues) => void;
  updateLiveLocation: (location: LocationFormValues) => void;
  error?: string;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => {
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
        loading: false,

        login: async (credentials: { email: string; password: string }) => {
          console.log("Login Credentials:", credentials);
          try {
            const loginResponse = await login(credentials);
            console.log("Login Response:", loginResponse);
            const token = loginResponse.token;
            if (!token) throw new Error("No token received from login");
            localStorage.setItem("authToken", token);
            await fetchUserData(token);
            toast.success("Logged in successfully");
          } catch (error) {
            set({ user: null, isLoggedIn: false, isAdmin: false });
            localStorage.removeItem("authToken");
            toast.error("Login failed", {
              description: (error as Error).message || "Invalid credentials",
            });
            throw error;
          }
        },

        setGoogleLogin: async (token: string) => {
          try {
            localStorage.setItem("authToken", token);
            await fetchUserData(token);
            toast.success("Logged in with Google successfully");
          } catch (error) {
            set({ user: null, isLoggedIn: false, isAdmin: false });
            localStorage.removeItem("authToken");
            toast.error("Google login failed", {
              description: (error as Error).message || "Invalid token",
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
              toast.error("Logout failed", {
                description: axios.isAxiosError(error)
                  ? error.message
                  : "Something went wrong",
              });
            }
          }
          set({ user: null, isLoggedIn: false, isAdmin: false });
          localStorage.removeItem("authToken");
        },

        initialize: async () => {
          const token = localStorage.getItem("authToken");
          if (token) {
            try {
              await fetchUserData(token);
            } catch (error) {
              console.error("Initialize failed:", error);
              set({ user: null, isLoggedIn: false, isAdmin: false });
              localStorage.removeItem("authToken");
            }
          }
        },

        fetchItems: async (page = 1, limit = 10, filters = {}) => {
          set({ loading: true, error: undefined });
          try {
            const API_URL =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const token = localStorage.getItem("authToken");
            if (!token) throw new Error("No auth token found");
            const mappedFilters = {
              search: filters.search,
              dateFrom: filters.createdAt?.from,
              dateTo: filters.createdAt?.to,
              role: filters.role,
            };
            const response = await axios.get(`${API_URL}/api/users`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { page, limit, ...mappedFilters },
            });
            console.log("Fetched users:", response.data.users);
            set({
              items: response.data.users || [],
              totalItems: response.data.totalUsers || 0,
              currentPage: response.data.currentPage || page,
              totalPages: response.data.totalPages || 1,
              limit: response.data.limit || limit,
              loading: false,
              error: undefined,
            });
          } catch (error) {
            const errorMessage =
              axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "Failed to fetch users";
            console.error("Fetch Users Error:", errorMessage);
            set({
              items: [],
              loading: false,
              error: errorMessage,
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
            toast.error("Error updating user role", {
              description: axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Unknown error",
            });
          }
        },

        deleteUser: async (id: string) => {
          const token = localStorage.getItem("authToken");
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

        updateLocation: (location: LocationFormValues) =>
          set((state) => ({
            user: state.user ? { ...state.user, location } : state.user,
          })),

        updateLiveLocation: (location: LocationFormValues) =>
          set((state) => ({
            user: state.user ? { ...state.user, location } : null,
          })),
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
