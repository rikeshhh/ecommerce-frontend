/* eslint-disable */

import axios from "axios";
import { Order } from "@/lib/types/order-type";

interface FetchOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

interface PromoValidationResult {
  success: boolean;
  promo?: any;
  message?: string;
}

interface OrderUpdatePayload {
  status?: string;
  paymentStatus?: string;
}

export const fetchOrders = async (
  params: FetchOrdersParams = {}
): Promise<{
  items: Order[];
  totalItems: number;
  totalPages: number;
}> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const { page = 1, limit = 10, search, dateFrom, dateTo, status } = params;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit,
          search,
          dateFrom,
          dateTo,
          status,
        },
      }
    );

    return {
      items: response.data.orders || [],
      totalItems: response.data.totalOrders || 0,
      totalPages: response.data.totalPages || 1,
    };
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch orders"
    );
  }
};

export const applyPromoCode = async (
  code: string,
  orders: any
): Promise<PromoValidationResult> => {
  const response = await fetch("/api/promo/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orders }),
  });

  const result = await response.json();
  return result;
};

export const cancelOrder = async (id: string): Promise<void> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
      { status: "Cancelled" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to cancel order"
    );
  }
};

export const updateOrder = async (
  id: string,
  payload: OrderUpdatePayload
): Promise<{ status: string; paymentStatus: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      status: response.data.status,
      paymentStatus: response.data.paymentStatus,
    };
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update order"
    );
  }
};
