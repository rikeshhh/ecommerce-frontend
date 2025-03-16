import OrderConfirmation from "@/components/order/order-confirmation";
import { Suspense } from "react";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading product confirmation...</div>}>
      <OrderConfirmation />
    </Suspense>
  );
}
