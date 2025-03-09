"use client";

import Image from "next/image";
import { Product } from "@/lib/types";

interface ProductThumbnailProps {
  product: Product;
}

export default function ProductThumbnail({ product }: ProductThumbnailProps) {
  const validImageSrc =
    typeof product.image === "string" &&
    (product.image.startsWith("/") || product.image.startsWith("http"))
      ? product.image
      : "/placeholder.png";

  return (
    <div className="relative h-32 w-32">
      <Image
        src={validImageSrc}
        alt={product.name}
        fill
        className="object-cover rounded-md"
        sizes="(max-width: 128px) 100vw"
        placeholder="blur"
        blurDataURL="/placeholder.jpg"
        onError={() => console.log(`Image failed to load for ${product.name}`)}
      />
    </div>
  );
}
