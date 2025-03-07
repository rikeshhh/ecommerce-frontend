"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/schema/zod-schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { dummyProducts } from "@/data/product";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const { addToCart } = useCart();
  const product = dummyProducts.find((prod) => prod._id === id);

  if (!product) {
    return <div>Loading...</div>;
  }
  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };
  return (
    <div className="w-full container mx-auto  p-6 bg-white rounded-md shadow-lg">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 pr-6">
          <Image
            src={product.image || "/default-product-image.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        <div className="w-1/2">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-lg text-gray-500 mb-2">{product.category}</p>
          <p className="text-xl text-gray-700 mb-6">{product.description}</p>

          <div className="flex justify-between items-center mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            <span className="text-sm text-gray-600">
              {product.stock} in stock
            </span>
          </div>

          <Button
            className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              You might also like
            </h3>
            <div className="flex space-x-4 overflow-x-scroll">
              {dummyProducts.slice(0, 3).map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="w-1/4 flex-shrink-0 bg-gray-100 p-4 rounded-md shadow-md"
                >
                  <Image
                    src={relatedProduct.image || "/default-product-image.jpg"}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="rounded-md object-cover mb-4"
                  />
                  <h4 className="text-lg font-medium text-gray-800">
                    {relatedProduct.name}
                  </h4>
                  <span className="text-lg text-gray-900">
                    ${relatedProduct.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Product Details
        </h3>
        <p className="text-lg text-gray-700">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
