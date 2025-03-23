"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import { useFavoritesStore } from "@/store/favorites-store";
import { fetchProductsByIds } from "@/lib/api/product-api";

export default function FavoritesPage() {
  const { favorites, loading: favoritesLoading } = useFavoritesStore();
  const router = useRouter();
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["favoriteProducts", favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      const fetchedProducts = await fetchProductsByIds(favorites);
      return fetchedProducts.filter((p) => p !== null);
    },
    enabled: favorites.length > 0, 
  });

  useEffect(() => {
    if (productsError) {
      setFetchError("Failed to load favorites");
      console.error("Load favorites error:", productsError);
    } else if (
      favorites.length > 0 &&
      products.length === 0 &&
      !productsLoading
    ) {
      setFetchError("No valid products found");
    } else {
      setFetchError(null);
    }
  }, [products, productsError, productsLoading, favorites]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {favoritesLoading || productsLoading ? (
        <p>Loading favorites...</p>
      ) : fetchError ? (
        <p className="text-red-500">{fetchError}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No favorites yet.</p>
          <p className="mt-4 text-muted-foreground">
            Log in to save your favorites permanently!
          </p>
          <Button onClick={() => router.push("/auth/signin")} className="mt-2">
            Log In
          </Button>
        </div>
      )}
    </div>
  );
}
