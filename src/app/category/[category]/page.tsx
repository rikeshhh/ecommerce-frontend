"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/product-store";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product/product-card";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    if (category) {
      console.log(`Fetching products for category: ${category}`);
      fetchProducts({ page: 1, limit: 10, category });
    }
  }, [category, fetchProducts]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category} Products
      </h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
