"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/lib/api/product-api";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import Sidebar from "@/components/product/product-listing/product-listing-sidebar";
import ProductGrid from "@/components/product/product-listing/product-listing-grid";
import { SearchComponent } from "@/components/common/search-component";
import { TablePagination } from "@/components/admin/Data-Table/table-pagination";

export default function ProductListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();
  const limit = isMobile ? 5 : 10;

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
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      { page: currentPage, limit, searchTerm, selectedCategory },
    ],
    queryFn: () =>
      fetchProducts({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      }),
    keepPreviousData: true,
  });

  const categories = categoriesData || [];
  const products = productsData?.items || [];
  const totalProducts = productsData?.totalItems || 0;
  const totalPages = productsData?.totalPages || 1;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;
  }, [products, selectedCategory]);

  const loading = categoriesLoading || productsLoading;
  const error = categoriesError || productsError;

  return (
    <div className="w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isMobile={isMobile}
        loading={loading}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: hasMounted ? 0 : 0.1 }}
        className="flex-1"
      >
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-10 flex-col sm:flex-row gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCategory || "All Products"}
          </h1>
          <SearchComponent
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setCurrentPage(1); 
            }}
          />
        </div>
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          error={
            error instanceof Error
              ? error.message
              : error
              ? "An error occurred"
              : null
          }
          onRetry={refetch}
        />
        {totalPages > 1 && (
          <TablePagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
            showItemCount={false}
            showLimitSelector={false}
            className="mt-8 flex justify-center"
            totalItems={totalProducts}
            limit={limit}
          />
        )}
      </motion.main>
    </div>
  );
}
