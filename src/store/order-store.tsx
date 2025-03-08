"use client";

import { create } from "zustand";
import axios from "axios";

interface Order {
  _id: string;
  user: { _id: string; name: string };
  products: { product: { _id: string; name: string }; quantity: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrderState {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],

  fetchOrders: async () => {
    const token = localStorage.getItem("authToken");
    console.log("Fetching orders with token:", token);
    if (!token) {
      set({ orders: [] });
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Orders received:", response.data);
      set({ orders: response.data });
    } catch (error) {
      console.error(
        "Error fetching orders:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
      set({ orders: [] });
    }
  },

  cancelOrder: async (id: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
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
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  },
}));
