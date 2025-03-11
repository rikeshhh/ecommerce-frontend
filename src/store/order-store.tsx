"use client";

import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

export interface Order {
  _id: string;
  user: { _id: string; name: string };
  customerName: string;
  products: { product: string; quantity: number; _id: string }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrderState {
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  newOrderCount: number; 
  lastChecked: string | null; 
  fetchOrders: (
    page: number,
    limit: number,
    filters?: {
      search?: string;
      createdAt?: { from?: string; to?: string };
      status?: string;
    }
  ) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  updateOrder: (
    id: string,
    status?: string,
    paymentStatus?: string
  ) => Promise<void>;
  markOrdersAsRead: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  loading: false,
  newOrderCount: 0,
  lastChecked: null, 

  fetchOrders: async (page = 1, limit = 10, filters = {}) => {
    set({ loading: true });
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in to view orders.",
      });
      set({
        orders: [],
        totalOrders: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        loading: false,
      });
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
            search: filters.search,
            dateFrom: filters.createdAt?.from,
            dateTo: filters.createdAt?.to,
            status: filters.status,
          },
        }
      );
      const newOrders = response.data.orders || [];
      const lastChecked = get().lastChecked;
      const newOrderCount = lastChecked
        ? newOrders.filter(
            (order: Order) => new Date(order.createdAt) > new Date(lastChecked)
          ).length
        : 0; 

      set({
        orders: newOrders,
        totalOrders: response.data.totalOrders || 0,
        currentPage: response.data.currentPage || page,
        totalPages: response.data.totalPages || 1,
        limit: response.data.limit || limit,
        loading: false,
        newOrderCount: get().newOrderCount + newOrderCount, 
        lastChecked: new Date().toISOString(), 
      });
    } catch (error) {
      toast.error("Error fetching orders", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unknown error",
      });
      set({
        orders: [],
        totalOrders: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        loading: false,
      });
    }
  },

  cancelOrder: async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in to cancel an order.",
      });
      return;
    }
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, status: "Cancelled" } : order
        ),
      }));
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Error cancelling order", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unknown error",
      });
    }
  },

  updateOrder: async (id: string, status?: string, paymentStatus?: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in to update an order.",
      });
      return;
    }
    try {
      const payload: { status?: string; paymentStatus?: string } = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id
            ? {
                ...order,
                status: response.data.status,
                paymentStatus: response.data.paymentStatus,
              }
            : order
        ),
      }));
      toast.success("Order updated successfully");
    } catch (error) {
      console.error(
        "Update Order Error:",
        (error as any).response?.data || (error as any).message
      );
      toast.error("Error updating order", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unknown error",
      });
    }
  },

  markOrdersAsRead: () => {
    set({ newOrderCount: 0 });
  },
}));
function get() {
  throw new Error("Function not implemented.");
}

