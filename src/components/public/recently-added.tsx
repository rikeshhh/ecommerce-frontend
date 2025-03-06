"use client";
import { dummyProducts } from "@/data/product";
import ProductCard from "../product/product-card";

export default function RecentlyAdded() {
  const displayedProducts = dummyProducts.slice(0, 4);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Recently Added Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full ">
        {displayedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
