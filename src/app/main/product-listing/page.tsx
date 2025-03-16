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
import { Search, ChevronDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "@/components/product/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductListingPage() {
  const {
    products,
    categories,
    fetchProducts,
    fetchCategories,
    loading,
    error,
    totalProducts,
  } = useProductStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [limit, setLimit] = useState(6);
  const [categorySearch, setCategorySearch] = useState("");
  const productsPerLoad = 9;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (categories.length === 0 && !loading) {
      fetchCategories();
    }
    fetchProducts({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      limit,
    });
  }, [fetchProducts, fetchCategories, searchTerm, selectedCategory, limit]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = products.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [products, selectedCategory]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  const hasMore = filteredProducts.length < totalProducts;
  const canViewLess = limit > productsPerLoad;

  const sidebarX = isMobile && isSidebarOpen ? 0 : -300;

  const handleViewMore = () => {
    setLimit((prev) => prev + productsPerLoad);
  };

  const handleViewLess = () => {
    setLimit((prev) => Math.max(productsPerLoad, prev - productsPerLoad));
  };

  return (
    <div className="w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {isMobile && (
        <div className="mb-4">
          <Button
            onClick={() => setIsSidebarOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <ChevronDown className="mr-2 h-4 w-4" /> Show Categories
          </Button>
        </div>
      )}

      <motion.aside
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: isMobile ? sidebarX : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800 shadow-lg md:shadow-none",
          isMobile && "h-full border-r"
        )}
      >
        <div className="sticky top-0 p-4 bg-white dark:bg-gray-800 z-10 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Categories
            </h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)] px-4">
          {loading && categories.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No categories found.
            </p>
          ) : (
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left text-sm font-medium",
                  selectedCategory === null
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                )}
                onClick={() => setSelectedCategory(null)}
              >
                All Products
              </Button>
              {filteredCategories.map((category) => (
                <Button
                  key={category.slug}
                  variant={
                    selectedCategory === category.name ? "default" : "ghost"
                  }
                  className={cn(
                    "w-full justify-start text-left text-sm font-medium",
                    selectedCategory === category.name
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
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
          {loading && products.length === 0 ? (
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

        <div className="mt-8 flex justify-center gap-4">
          {hasMore && (
            <Button
              onClick={handleViewMore}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "View More"}
            </Button>
          )}
          {canViewLess && (
            <Button
              onClick={handleViewLess}
              className="bg-gray-600 hover:bg-gray-700 text-white"
              disabled={loading}
            >
              View Less
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
