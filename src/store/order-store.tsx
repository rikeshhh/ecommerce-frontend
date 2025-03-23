"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { OrderState } from "@/lib/types/order-type";
import {
  fetchOrders,
  applyPromoCode,
  cancelOrder,
  updateOrder,
} from "@/lib/api/order-api";

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
    try {
      const result = await fetchOrders({
        page,
        limit,
        search: filters.search,
        dateFrom: filters.createdAt?.from,
        dateTo: filters.createdAt?.to,
        status: filters.status,
      });

      const newOrders = result.items;
      const lastChecked = get().lastChecked;
      const newOrderCount = lastChecked
        ? newOrders.filter(
            (order) => new Date(order.createdAt) > new Date(lastChecked)
          ).length
        : 0;

      set({
        orders: newOrders,
        totalOrders: result.totalItems,
        currentPage: page,
        totalPages: result.totalPages,
        limit,
        loading: false,
        newOrderCount: get().newOrderCount + newOrderCount,
        lastChecked: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";
      toast.error("Error fetching orders", { description: errorMessage });
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
    try {
      const result = await applyPromoCode(code, orders);
      if (result.success) {
        set({ activePromo: result.promo });
      }
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to apply promo code";
      toast.error("Error applying promo code", { description: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  cancelOrder: async (id: string) => {
    try {
      await cancelOrder(id);
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, status: "Cancelled" } : order
        ),
      }));
      toast.success("Order cancelled successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel order";
      toast.error("Error cancelling order", { description: errorMessage });
    }
  },

  updateOrder: async (id: string, status?: string, paymentStatus?: string) => {
    try {
      const payload: { status?: string; paymentStatus?: string } = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const updatedOrder = await updateOrder(id, payload);
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id
            ? {
                ...order,
                status: updatedOrder.status,
                paymentStatus: updatedOrder.paymentStatus,
              }
            : order
        ),
      }));
      toast.success("Order updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update order";
      toast.error("Error updating order", { description: errorMessage });
    }
  },

  markOrdersAsRead: () => {
    set({ newOrderCount: 0 });
  },
}));
