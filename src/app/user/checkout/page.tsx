import Checkout from "@/components/checkout/checkout-form";
import { JSX, Suspense } from "react";

export default function CheckoutPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="text-center font-black">Loading checkout...</div>
      }
    >
      <Checkout />
    </Suspense>
  );
}
