"use client";

import { useState, useEffect } from "react";
import ProductCard from "../product/product-card";
import { useProductStore } from "@/store/product-store";
import { Product } from "@/lib/types";

export default function RecentlyAdded() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products: storeProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts({ page: 1, limit: 10 });
        setProducts(storeProducts.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
        console.error("Load error:", err);
      }
    };

    loadProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Recently Added Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
