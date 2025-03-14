"use client";

import { useState, useCallback, useEffect } from "react";
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
  img: string;
  color: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedImage, setSelectedImage] =
    useState<string>("/placeholder.png");
  useEffect(() => {
    const img =
      typeof product.image === "string" && product.image.trim()
        ? product.image
        : "/placeholder.png";
    const finalImg =
      img.startsWith("http") || img.startsWith("https")
        ? img
        : `${process.env.NEXT_PUBLIC_API_URL}${
            img.startsWith("/") ? img : `/${img}`
          }`;
    setSelectedImage(finalImg);
  }, [product.image, product._id]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { favorites, toggleFavorite, loading } = useFavoritesStore();
  const router = useRouter();
  const { addToCart } = useCartStore();

  const isFavorite = favorites.includes(product._id);

  const colorOptions: ColorOption[] = [
    { img: product.image || "/placeholder.png", color: "#FF5733" },
    { img: product.image || "/placeholder.png", color: "#33FF57" },
    { img: product.image || "/placeholder.png", color: "#3357FF" },
  ];

  const handleFavoriteToggle = useCallback(async () => {
    try {
      await toggleFavorite(product._id);
    } catch (error) {
      console.error("Toggle favorite failed:", error);
    }
  }, [product._id, toggleFavorite]);

  const handleColorChange = useCallback((img: string, color: string) => {
    setSelectedImage(img);
    setSelectedColor(color);
  }, []);

  const handleViewDetails = useCallback(() => {
    router.push(`/main/products-detail?id=${product._id}`);
  }, [router, product._id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    toast.success(`${product.name} has been added to your cart`);
  }, [addToCart, product]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setSelectedImage("/placeholder.png");
  };

  useEffect(() => {
    const img =
      typeof product.image === "string" && product.image.trim()
        ? product.image
        : "/placeholder.png";
    const finalImg =
      img.startsWith("http") || img.startsWith("https")
        ? img
        : `${process.env.NEXT_PUBLIC_API_URL}${
            img.startsWith("/") ? img : `/${img}`
          }`;
    setSelectedImage(finalImg);
  }, [product.image]);

  return (
    <motion.div
      className="w-[300px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-52 w-full bg-gray-100 dark:bg-gray-700">
        <div className="relative h-52 w-full bg-gray-100 dark:bg-gray-700">
          <Image
            src={selectedImage || "placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 hover:opacity-90"
            sizes="(max-width: 300px) 100vw"
            placeholder="blur"
            onError={handleImageError}
            blurDataURL="/placeholder.png"
          />
        </div>
        <motion.button
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 dark:bg-gray-800/80"
          onClick={handleFavoriteToggle}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: isFavorite ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 1000, damping: 10 }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          disabled={loading}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-400 text-red-400" : "text-gray-500"
            )}
          />
        </motion.button>
      </div>

      <div className="p-4 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold truncate">{product.name}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.color}
                onClick={() => handleColorChange(option.img, option.color)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all duration-200",
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

        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            className="w-full border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
