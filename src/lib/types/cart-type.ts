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
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleItemSelection: (id: string) => void;
  clearSelectedItems: (itemsToClear?: string[]) => void;
  clearCart: () => void;
}
