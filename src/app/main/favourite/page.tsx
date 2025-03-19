"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ProductCard from "@/components/product/product-card";
import { useFavoritesStore } from "@/store/favorites-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function FavoritesPage() {
  const { favorites, loading } = useFavoritesStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      setFetchError(null);
      try {
        if (favorites.length > 0) {
          const fetchedProducts = await Promise.all(
            favorites.map(async (id) => {
              try {
                const res = await axios.get(`${API_URL}/api/products/${id}`);
                return res.data.product;
              } catch (error) {
                console.error(`Product ${id} fetch failed:`, error);
                return null;
              }
            })
          );
          const validProducts = fetchedProducts.filter((p) => p !== null);
          setProducts(validProducts);
          if (validProducts.length === 0) {
            setFetchError("No valid products found");
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        setFetchError("Failed to load favorites");
        console.error("Load favorites error:", error);
      }
    };

    loadFavorites();
  }, [favorites]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {loading ? (
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
