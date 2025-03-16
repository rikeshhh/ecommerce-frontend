interface OrderItem {
  product: string;
  quantity: number;
}

interface OrderData {
  products: OrderItem[];
  totalAmount: number;
}

interface OrderResponse {
  _id?: string;
  user?: string;
  products?: Array<{
    product: string;
    quantity: number;
  }>;
  totalAmount?: number;
  message?: string;
  error?: string;
}

export async function placeOrder(
  orderData: OrderData,
  token: string
): Promise<OrderResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data: OrderResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Place order failed"
    );
  }
}

export async function getOrders(token: string): Promise<OrderResponse[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: OrderResponse[] = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Get orders failed"
    );
  }
}
