"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface ProductGridProps {
  products: { _id: string; name: string; price: number; image?: string }[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
}: ProductGridProps) {
  return (
    <AnimatePresence mode="wait">
      {loading && !products.length ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Loading products...
          </p>
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-12 text-center">
            <CardHeader>
              <CardTitle>Oops!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button onClick={onRetry}>Retry</Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : !products.length ? (
        <motion.div
          key="no-products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-12 text-center">
            <CardDescription className="text-gray-500 dark:text-gray-400">
              No products found matching your criteria.
            </CardDescription>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="products"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href={`/main/products-detail?id=${product._id}`}
                className="block"
              >
                <div className="w-full max-w-[300px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative w-full h-36 sm:h-56 overflow-hidden">
                    <Image
                      fill
                      src={product.image || "placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-xs sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-700">
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          रु
                        </strong>{" "}
                        <span>{product.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
