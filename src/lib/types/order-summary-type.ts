export interface OrderSummaryProps {
  cart: { _id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  promoApplied: { code: string; discount: number } | null;
}
