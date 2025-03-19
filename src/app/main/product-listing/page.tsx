"use client";

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "@/store/product-store";
import { useIsMobile } from "@/hooks/use-mobile";

import { motion } from "framer-motion";
import Sidebar from "@/components/product/product-listing/product-listing-sidebar";
import ProductGrid from "@/components/product/product-listing/product-listing-grid";
import { SearchComponent } from "@/components/common/search-component";
import { TablePagination } from "@/components/admin/Data-Table/table-pagination";

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
            onSearchChange={setSearchTerm}
          />
        </div>
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          error={error ?? null}
          onRetry={fetchProducts}
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
