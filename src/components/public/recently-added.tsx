"use client";

import { useEffect } from "react";
import ProductCard from "../product/product-card";
import { useProductStore } from "@/store/product-store";
import { motion } from "framer-motion";

export default function RecentlyAdded() {
  const {
    products: storeProducts,
    fetchProducts,
    loading,
    error,
  } = useProductStore();

  useEffect(() => {
    console.log("Mounting RecentlyAdded, fetching products...");
    fetchProducts({ page: 1, limit: 10 })
      .then((result) => {
        console.log("Fetch result:", result);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
      });
  }, [fetchProducts]);
  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }
  const recentProducts = storeProducts.slice(0, 4);

  if (!recentProducts.length) {
    return <div className="py-8 text-center">No recently added products</div>;
  }

  return (
    <section className="p-4 md:p-16 container min-h-screen flex flex-col justify-center items-start w-full">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-10 text-start "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Recently Added Product{" "}
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 w-full">
        {recentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
