"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useProductStore } from "@/store/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, ChevronDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pagination } from "@/components/ui/pagination";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Link from "next/link";
import Image from "next/image";

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
  const [categorySearch, setCategorySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();
  const limit = isMobile ? 5 : 10;
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(
    sidebarRef,
    isSidebarOpen,
    () => setIsSidebarOpen(false),
    isMobile
  );

  useEffect(() => {
    const loadData = async () => {
      if (categories.length === 0 && !loading) {
        await fetchCategories();
      }
      await fetchProducts({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      });
      setHasMounted(true);
    };
    loadData();
  }, [
    fetchProducts,
    fetchCategories,
    searchTerm,
    selectedCategory,
    currentPage,
    limit,
  ]);

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

  const totalPages = Math.ceil(totalProducts / limit);
  const sidebarX = isMobile && isSidebarOpen ? 0 : -300;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderSidebar = hasMounted && (
    <motion.aside
      ref={sidebarRef}
      initial={{ x: isMobile ? -300 : 0, opacity: 0 }}
      animate={{ x: isMobile ? sidebarX : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-transparent shadow-lg md:shadow-none",
        isMobile && "h-full border-r"
      )}
    >
      <div className="sticky top-0 p-4  z-10 border-b mb-4 ">
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
  );

  return (
    <div className="w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {renderSidebar}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: hasMounted ? 0 : 0.1 }}
        className="flex-1"
      >
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-10 flex-col sm:flex-row gap-4">
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-white">
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
        {isMobile && (
          <div className="mb-4">
            <Button
              onClick={() => setIsSidebarOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white max-sm:text-sm"
            >
              <ChevronDown className="mr-1 h-4 w-4" /> Show Categories
            </Button>
          </div>
        )}
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {filteredProducts.map((product) => (
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
                      <div className="relative w-full h-36 sm:h-56  overflow-hidden">
                        <Image
                          fill
                          src={product.image || "placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {/* {product.discount && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </span>
                        )} */}
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-xs sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-gray-700">
                            <strong>NPR</strong>{" "}
                            <span> {product.price.toFixed(2)}</span>
                          </p>
                          {/* {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </p>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              showFirstLast={true}
              siblingCount={1}
              className="text-xs sm:text-sm"
            />
          </div>
        )}
      </motion.main>
    </div>
  );
}
