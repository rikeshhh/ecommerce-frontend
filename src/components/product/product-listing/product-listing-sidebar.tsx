"use client";

import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface SidebarProps {
  categories: { name: string; slug: string }[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  isMobile: boolean;
  loading: boolean;
}

export default function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  isMobile,
  loading,
}: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(
    sidebarRef,
    isSidebarOpen,
    () => setIsSidebarOpen(false),
    isMobile
  );

  const filteredCategories = useMemo(() => {
    return categorySearch
      ? categories.filter((c) =>
          c.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
      : categories;
  }, [categories, categorySearch]);

  const sidebarX = isMobile && isSidebarOpen ? 0 : -300;

  return (
    <>
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
        <div className="sticky top-0 p-4 z-10 border-b mb-4">
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
          {loading && !categories.length ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
                />
              ))}
            </div>
          ) : !filteredCategories.length ? (
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
    </>
  );
}
