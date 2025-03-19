"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites-store";

interface ProductCardProps {
  product: Product;
}

interface ColorOption {
  color: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.image && typeof product.image === "string" && product.image.trim()
      ? product.image
      : "/placeholder.png"
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { favorites, toggleFavorite, loading } = useFavoritesStore();
  const router = useRouter();
  const { addToCart } = useCartStore();

  const isFavorite = favorites.includes(product._id);

  const colorOptions: ColorOption[] = [
    { color: "#FF5733" },
    { color: "#33FF57" },
    { color: "#3357FF" },
  ];

  const handleFavoriteToggle = useCallback(async () => {
    try {
      await toggleFavorite(product._id);
    } catch (error) {
      console.error("Toggle favorite failed:", error);
    }
  }, [product._id, toggleFavorite]);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleViewDetails = useCallback(() => {
    router.push(`/main/products-detail?id=${product._id}`);
  }, [router, product._id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.success(`${product.name} has been added to your cart`);
  }, [addToCart, product]);

  const handleImageError = () => {
    setSelectedImage("/placeholder.png");
  };

  return (
    <motion.div
      className={cn(
        "w-[168px] sm:max-w-[300px] sm:w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      )}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-32 sm:h-52 w-full bg-gray-100 dark:bg-gray-700">
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          className="transition-opacity duration-300 hover:opacity-90"
          sizes="(max-width: 640px) 200px, (max-width: 768px) 100vw, 300px"
          placeholder="blur"
          blurDataURL="/placeholder.png"
          onError={handleImageError}
        />
        <motion.button
          className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 rounded-full bg-white/80 dark:bg-gray-800/80"
          onClick={handleFavoriteToggle}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: isFavorite ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 1000, damping: 10 }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          ) : (
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-400 text-red-400" : "text-gray-500"
              )}
            />
          )}
        </motion.button>
      </div>

      <div className="p-2 sm:p-4 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-sm sm:text-xl font-semibold truncate">
            {product.name}
          </h3>
        </div>
        <p className="max-sm:text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 sm:line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex justify-between items-center mt-1 sm:mt-3">
          <span className="max-sm:text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <strong>NPR</strong> {product.price.toFixed(2)}
          </span>
          <div className="flex gap-1">
            {colorOptions.map((option) => (
              <button
                key={option.color}
                onClick={() => handleColorChange(option.color)}
                className={cn(
                  "w-4 sm:w-6 h-4 sm:h-6 rounded-full border-2 transition-all duration-200",
                  selectedColor === option.color
                    ? "border-indigo-500 scale-110"
                    : "border-gray-300"
                )}
                style={{ backgroundColor: option.color }}
                aria-label={`Select ${option.color} color`}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex gap-2 sm:space-y-2 flex-col">
          <Button
            variant="outline"
            className="flex-1 text-xs md:text-sm border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 py-1 sm:py-2"
            onClick={handleViewDetails}
          >
            Details
          </Button>
          <Button
            className="flex-1 text-xs md:text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1 md:py-2"
            onClick={handleAddToCart}
          >
            Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
