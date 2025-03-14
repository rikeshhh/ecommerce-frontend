"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/product-store";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const { addToCart } = useCartStore();
  const {
    selectedProduct,
    products,
    loading,
    error,
    fetchProductById,
    fetchProducts,
  } = useProductStore();
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        await fetchProductById(id);
        const product = useProductStore.getState().selectedProduct;
        if (product) {
          await fetchProducts({
            category: product.category,
            limit: 3,
            exclude: id,
          });
          setRelatedProducts(useProductStore.getState().products);
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };

    fetchData();
  }, [id, fetchProductById, fetchProducts]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct);
    toast.success(`${selectedProduct.name} added to cart!`, {
      duration: 3000,
      style: { background: "#10B981", color: "white" },
    });
  };

  const normalizeImageUrl = (image?: string) => {
    console.log("Raw Image URL:", image);
    const normalized = !image
      ? "/placeholder.png"
      : image.startsWith("http://") || image.startsWith("https://")
      ? image
      : image.startsWith("/")
      ? image
      : `/uploads/${image}`;
    console.log("Normalized Image URL:", normalized);
    return normalized;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center border border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-400">
              Oops!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              {error || "Product not found"}
            </p>
            <Button
              asChild
              variant="outline"
              className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-800"
            >
              <Link href="/main/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="relative h-[400px] lg:h-[500px] w-full">
            <Image
              src={normalizeImageUrl(selectedProduct.image)}
              alt={selectedProduct.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
            <Badge className="absolute top-4 left-4 bg-indigo-600 text-white">
              {selectedProduct.category}
            </Badge>
          </div>

          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                {selectedProduct.category}
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {selectedProduct.description || "No description available."}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <Badge
                  variant={
                    selectedProduct.stock > 0 ? "default" : "destructive"
                  }
                  className="text-sm"
                >
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} in stock`
                    : "Out of stock"}
                </Badge>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock <= 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedProduct.description ||
                  "No additional details available."}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <Card className="bg-white dark:bg-gray-800 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                You Might Also Like
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct._id}
                      href={`/main/products-detail?id=${relatedProduct._id}`}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.03, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative h-40 w-full mb-4">
                          <Image
                            src={normalizeImageUrl(relatedProduct.image)}
                            alt={relatedProduct.name}
                            fill
                            className="rounded-md object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 150px) 100vw"
                          />
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-2">
                          {relatedProduct.name}
                        </h4>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  No related products found.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-gray-800"
          >
            <Link href="/main/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
