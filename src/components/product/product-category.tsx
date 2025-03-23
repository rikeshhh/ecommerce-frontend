"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/lib/api/product-api";

export default function ProductCategory() {
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 100 }],
    queryFn: () => fetchProducts({ page: 1, limit: 100 }),
  });

  const categories = categoriesData || [];
  const products = productsData?.items || [];

  const getCategoryCount = (category: string) =>
    products.filter((p) => p.category === category).length;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  if (categoriesLoading || productsLoading) {
    return (
      <section className="py-12 w-full container text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
        <p className="mt-2 text-muted-foreground">Loading categories...</p>
      </section>
    );
  }

  if (categoriesError || productsError) {
    const errorMessage =
      categoriesError instanceof Error
        ? categoriesError.message
        : productsError instanceof Error
        ? productsError.message
        : "Failed to load categories or products";
    return (
      <section className="py-12 w-full container text-center">
        <p className="text-red-500">{errorMessage}</p>
      </section>
    );
  }

  if (categories.length === 0 && !categoriesLoading && !categoriesError) {
    return (
      <section className="py-12 w-full container text-center">
        <p className="text-muted-foreground">No categories available.</p>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-16 container min-h-screen flex flex-col w-full">
      <motion.h2
        className="text-xl md:text-2xl font-bold mb-4 sm:mb-10 text-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Shop by Category
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.slug}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/category/${category.slug}`}>
              <Card
                className={cn(
                  "relative size-[160px] sm:w-full sm:h-72 overflow-hidden bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                )}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 33vw, 25vw"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="absolute bottom-0 py-4 sm:p-4 text-white">
                  <h3 className="text-base sm:text-lg font-semibold truncate drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 drop-shadow-md">
                    {getCategoryCount(category.name)}{" "}
                    {getCategoryCount(category.name) === 1
                      ? "product"
                      : "products"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
