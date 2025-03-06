import { dummyProducts } from "@/data/product";
import ProductThumbnail from "../product/product-thumbnail";

export default function ProductCategory() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
      <div className="flex flex-wrap gap-6 ">
        {dummyProducts.map((product) => (
          <ProductThumbnail key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
