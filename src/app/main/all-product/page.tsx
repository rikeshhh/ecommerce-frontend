"use client";

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/product-store";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { SearchComponent } from "@/components/common/search-component";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();
  const limit = isMobile ? 5 : 10;

  useEffect(() => {
    const loadData = async () => {
      if (!categories.length && !loading) await fetchCategories();
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
    return selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;
  }, [products, selectedCategory]);

  const totalPages = Math.ceil(totalProducts / limit);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="container mx-auto py-8 min-h-screen md:p-0 p-4">
      <div className="mt-8 z-10 bg-white dark:bg-gray-900 py-4 border-b">
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {selectedCategory || "All Products"}
          </h1>
          <div className="flex md:flex-row flex-col items-center gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <SearchComponent
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  Filter by Category <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => setSelectedCategory(null)}
                  className={
                    selectedCategory === null
                      ? "bg-indigo-100 font-semibold"
                      : ""
                  }
                >
                  All Products
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.slug}
                    onClick={() => setSelectedCategory(category.name)}
                    className={
                      selectedCategory === category.name
                        ? "bg-indigo-100 font-semibold"
                        : ""
                    }
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: hasMounted ? 0 : 0.1 }}
        className="flex-1 mt-8"
      >
        <AnimatePresence mode="wait">
          {loading && !products.length ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              className="flex justify-center"
            >
              <Card className="p-6 max-w-md w-full text-center">
                <CardHeader>
                  <CardTitle>Oops!</CardTitle>
                </CardHeader>
                <CardDescription className="text-red-500">
                  {error}
                </CardDescription>
                <Button onClick={() => fetchProducts()} className="mt-4">
                  Retry
                </Button>
              </Card>
            </motion.div>
          ) : !filteredProducts.length ? (
            <motion.div
              key="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <Card className="p-6 max-w-md w-full text-center">
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  No products found matching your criteria.
                </CardDescription>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Link
                    href={`/main/products-detail?id=${product._id}`}
                    className="block"
                  >
                    <Card className="overflow-hidden transition-shadow hover:shadow-xl">
                      <div className="relative w-full h-24 md:h-56">
                        <Image
                          fill
                          src={product.image || "placeholder.png"}
                          alt={product.name}
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="sm:p-4 px-2">
                        <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 dark:text-white sm:mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="sm:text-lg font-bold text-gray-700 dark:text-gray-300">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              showFirstLast={true}
              siblingCount={1}
              className="text-sm"
            />
          </div>
        )}
      </motion.main>
    </div>
  );
}
