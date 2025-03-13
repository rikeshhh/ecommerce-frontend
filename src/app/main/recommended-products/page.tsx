"use client";

import ProductCard from "@/components/product/product-card";
import { useProductStore } from "@/store/product-store";
import { useEffect } from "react";

const Recommendations = () => {
  const { recommendations, fetchRecommendations, loading, error } =
    useProductStore();

  useEffect(() => {
    fetchRecommendations("67d1ca8ad8141f9c6c424384");
  }, [fetchRecommendations]);

  if (loading)
    return <p className="text-center py-4">Loading recommendations...</p>;
  if (error)
    return <p className="text-red-500 text-center py-4">Error: {error}</p>;
  if (!recommendations.length) return null;

  return (
    <div className="w-full py-8 container mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Recommended for You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
