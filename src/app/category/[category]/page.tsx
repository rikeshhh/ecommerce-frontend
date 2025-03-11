"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/product-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
}

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
            <Card
              key={product._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <Image
                  src={
                    product.image
                      ? `/uploads/${product.image}`
                      : "/placeholder.png"
                  }
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ${product.price.toLocaleString()}
                </p>
                <p className="text-sm">Stock: {product.stock}</p>
              </CardContent>
            </Card>
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
