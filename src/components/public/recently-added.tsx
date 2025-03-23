"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/product-api";
import ProductCard from "../product/product-card";
import { motion } from "framer-motion";

export default function RecentlyAdded() {
  const {
    data: productsData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 10 }],
    queryFn: () => fetchProducts({ page: 1, limit: 10 }),
    select: (data) => {
      const sortedProducts = [...data.items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sortedProducts.slice(0, 4);
    },
  });

  const recentProducts = productsData || [];

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return <div className="py-8 text-center text-red-500">{errorMessage}</div>;
  }

  if (!recentProducts.length) {
    return <div className="py-8 text-center">No recently added products</div>;
  }

  return (
    <section className="p-4 md:p-16 container min-h-screen flex flex-col justify-center items-start w-full">
      <motion.h2
        className="text-xl md:text-2xl font-bold mb-4 sm:mb-10 text-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Recently Added Products
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full">
        {recentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
