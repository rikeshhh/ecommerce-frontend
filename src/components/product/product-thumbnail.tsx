"use client";

import Image from "next/image";
import { normalizeImageUrl } from "@/lib/utils/utils";
import { Product } from "@/lib/types/product-type";

interface ProductThumbnailProps {
  product: Product;
}

export default function ProductThumbnail({ product }: ProductThumbnailProps) {
  return (
    <div className="relative h-32 w-32">
      <Image
        src={normalizeImageUrl(product.image)}
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
