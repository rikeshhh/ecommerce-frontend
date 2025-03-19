import Cart from "@/components/cart/cart";
import RecentlyAdded from "@/components/public/recently-added";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <section className="min-h-screen container mx-auto py-10">
      <Suspense
        fallback={
          <div className="text-center py-10">
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Loading cart...
            </span>
          </div>
        }
      >
        <Cart />
      </Suspense>

      <Suspense
        fallback={
          <div className="text-center py-10">
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Loading recently added items...
            </span>
          </div>
        }
      >
        <RecentlyAdded />
      </Suspense>
    </section>
  );
}
