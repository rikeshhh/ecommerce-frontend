import React from "react";
import Image from "next/image";
import { Product } from "@/lib/schema/zod-schema";

interface ProductThumbnailProps {
  product: Product;
}

export default function ProductThumbnail({ product }: ProductThumbnailProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={product.image || "/placeholder.jpg"}
        alt={product.category}
        width={100}
        height={100}
        className="w-20 h-20 rounded-full object-cover border"
      />
      <p className="text-sm text-gray-700 mt-2">{product.category}</p>
    </div>
  );
}
