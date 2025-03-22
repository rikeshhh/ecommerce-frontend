"use client";

import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Order, OrderState } from "@/lib/types/order-type";

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  activePromo: null,
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
      return { items: [], totalItems: 0, totalPages: 1 };
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

      const result = {
        items: newOrders,
        totalItems: response.data.totalOrders || 0,
        totalPages: response.data.totalPages || 1,
      };

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

      return result;
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
      return { items: [], totalItems: 0, totalPages: 1 };
    }
  },
  applyPromoCode: async (code, orders) => {
    const res = await fetch("/api/promo/validate", {
      method: "POST",
      body: JSON.stringify({ code, orders }),
    });
    const result = await res.json();
    if (result.success) {
      set({ activePromo: result.promo });
      return { success: true };
    }
    return { success: false, message: result.message };
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
        (error as AxiosError).response?.data || (error as Error).message
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
