"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/product-store";
import ProductThumbnail from "../product/product-thumbnail";

export default function ProductCategory() {
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    console.log("Fetching products...");
    fetchProducts().catch((error) => console.error("Fetch failed:", error));
  }, [fetchProducts]);

  console.log("Products:", products);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products available.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {products.map((product) => (
            <ProductThumbnail key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
