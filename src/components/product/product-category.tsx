"use client";

import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { motion } from "framer-motion";

export default function ProductCategory() {
  const {
    fetchCategories,
    fetchProducts,
    categories,
    products,
    loading,
    error,
  } = useProductStore();

  useEffect(() => {
    if (categories.length === 0 && !loading) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length, loading]);

  const getCategoryCount = (category: string) =>
    products.filter((p) => p.category === category).length;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  if (loading) {
    return (
      <section className="py-12 w-full container text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
        <p className="mt-2 text-muted-foreground">Loading categories...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 w-full container text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (categories.length === 0 && !loading && !error) {
    return (
      <section className="py-12 w-full container text-center">
        <p className="text-muted-foreground">No categories available.</p>
      </section>
    );
  }

  return (
    <section className="py-16 w-full container">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Shop by Category
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <Card className="relative h-72 overflow-hidden bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-lg font-semibold drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200 drop-shadow-md">
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
