"use client";

import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

interface Order {
  _id: string;
  user: { _id: string; name: string };
  products: { product: { _id: string; name: string }; quantity: number }[];
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
  fetchOrders: (page: number, limit: number) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  updateOrder: (
    id: string,
    status?: string,
    paymentStatus?: string
  ) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,

  fetchOrders: async (page = 1, limit = 10) => {
    const token = localStorage.getItem("authToken");
    console.log(
      "Fetching orders - Token:",
      token,
      "Page:",
      page,
      "Limit:",
      limit
    );
    if (!token) {
      console.log("No token found, resetting orders");
      toast.error("Authentication required", {
        description: "Please log in to view orders.",
      });
      set({
        orders: [],
        totalOrders: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
      });
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        }
      );
      console.log("Orders response data:", response.data);
      set({
        orders: response.data.orders || [],
        totalOrders: response.data.totalOrders || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        limit: response.data.limit || 10,
      });
      if (!response.data.orders || response.data.orders.length === 0) {
        console.log("No orders returned from backend");
        toast.info("No orders found", {
          description: "There are no orders to display at the moment.",
        });
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
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
      console.error(
        "Error cancelling order:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
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
        "Error updating order:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
      toast.error("Error updating order", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unknown error",
      });
    }
  },
}));
