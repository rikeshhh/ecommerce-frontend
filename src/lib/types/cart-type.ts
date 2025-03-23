import { Product } from "./product-type";

export interface CartResponse {
  _id?: string;
  user?: string;
  items?: Array<{
    _id?: string;
    product: string;
    quantity: number;
  }>;
  message?: string;
  error?: string;
}
export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  cart: CartItem[];
  selectedItems: string[];
  initializeCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  toggleItemSelection: (id: string) => void;
  clearSelectedItems: (itemsToClear?: string[]) => Promise<void>;
  clearCart: () => Promise<void>;
}
