"use client";
import { useState } from "react";
import { Product } from "@/lib/schema/zod-schema";
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
import { Search } from "lucide-react";
import { dummyProducts } from "@/data/product";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductCard from "@/components/product/product-card";

const ProductListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = Array.from(new Set(dummyProducts.map((p) => p.category)));

  const filteredProducts = dummyProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full md:w-auto"
        >
          {isSidebarOpen ? "Hide Categories" : "Show Categories"}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 flex-shrink-0`}
      >
        <div className="sticky top-8">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                All Products ({dummyProducts.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} (
                  {dummyProducts.filter((p) => p.category === category).length})
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {selectedCategory || "All Products"}
          </h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CardDescription className="text-muted-foreground">
              No products found matching your search criteria.
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
