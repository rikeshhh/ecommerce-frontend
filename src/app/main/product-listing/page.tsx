"use client";

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "@/components/product/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductListingPage() {
  const { products, fetchProducts, loading, error } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProducts({
      search: searchTerm,
    });
  }, [fetchProducts, searchTerm]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const getCategoryCount = (category: string) =>
    products.filter((p) => p.category === category).length;

  const filteredProducts = useMemo(() => products, [products]);

  const sidebarX =
    isMobile === undefined ? -300 : isSidebarOpen || !isMobile ? 0 : -300;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {isMobile && (
        <div className="mb-4">
          <Button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            {isSidebarOpen ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" /> Hide Categories
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" /> Show Categories
              </>
            )}
          </Button>
        </div>
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg md:shadow-none",
          isMobile ? (isSidebarOpen ? "block" : "hidden") : "block"
        )}
      >
        <div className="sticky top-8 p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Categories
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-start text-left hover:bg-indigo-100 dark:hover:bg-gray-700"
                onClick={() => setSelectedCategory(null)}
              >
                All Products ({products.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="w-full justify-start text-left hover:bg-indigo-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedCategory(category as string)}
                >
                  {category} ({getCategoryCount(category || "")})
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </motion.aside>

      <main className="flex-1">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedCategory || "All Products"}
          </h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
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
                  <Button onClick={() => fetchProducts()}>Retry</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
