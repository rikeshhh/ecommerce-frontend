export interface Order {
  _id: string;
  user: { _id: string; name: string };
  customerName: string;
  products: {
    product: {
      _id: string;
      name: string;
      image?: string;
      price?: number;
    } | null;
    quantity: number;
    image?: string;
    _id: string;
  }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface PromoCode {
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  productIds?: string[];
  category?: string;
}
export interface OrderState {
  orders: Order[];
  activePromo: PromoCode | null;
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
  ) => Promise<{ items: Order[]; totalItems: number; totalPages: number }>;
  applyPromoCode: (
    code: string,
    orders: Order[]
  ) => Promise<{ success: boolean; message?: string }>;
  cancelOrder: (id: string) => Promise<void>;
  updateOrder: (
    id: string,
    status?: string,
    paymentStatus?: string
  ) => Promise<void>;
  markOrdersAsRead: () => void;
}
