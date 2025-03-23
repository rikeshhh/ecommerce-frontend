import { CartItem, CartResponse } from "../types/cart-type";

export async function addToCart(
  cartData: CartItem,
  token: string
): Promise<CartResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartData),
    });

    const data: CartResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Add to cart failed"
    );
  }
}

export async function getCart(token: string): Promise<CartResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: CartResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch cart");
    }
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Get cart failed");
  }
}

export async function removeFromCart(
  itemId: string,
  token: string
): Promise<CartResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: CartResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to remove item from cart");
    }
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Remove from cart failed"
    );
  }
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number,
  token: string
): Promise<CartResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cart/${itemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );

    const data: CartResponse = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update cart quantity");
    }
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Update cart quantity failed"
    );
  }
}

export async function clearCart(token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to clear cart");
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Clear cart failed"
    );
  }
}
