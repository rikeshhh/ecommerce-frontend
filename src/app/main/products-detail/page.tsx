import ProductDetail from "@/components/product/product-detail";
import { Suspense } from "react";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div>Loading product details...</div>}>
      <ProductDetail />
    </Suspense>
  );
}
