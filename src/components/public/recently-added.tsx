"use client";

import { useEffect } from "react";
import ProductCard from "../product/product-card";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/lib/types";

export default function RecentlyAdded() {
  const {
    products: storeProducts,
    fetchProducts,
    loading,
    error,
  } = useProductStore();

  useEffect(() => {
    if (!storeProducts.length) {
      fetchProducts({ page: 1, limit: 10 });
    }
  }, [fetchProducts, storeProducts.length]);

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  const recentProducts = storeProducts.slice(0, 4);

  if (!recentProducts.length) {
    return <div className="py-8 text-center">No recently added products</div>;
  }

  return (
    <div className="py-8 w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        Recently Added Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {recentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
