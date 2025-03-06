import Cart from "@/components/cart/cart";
import RecentlyAdded from "@/components/public/recently-added";

export default function CartPage() {
  return (
    <section className="min-h-screen container mx-auto py-10">
      <Cart />
      <RecentlyAdded />
    </section>
  );
}
