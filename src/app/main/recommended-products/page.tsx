"use client";

import ProductCard from "@/components/product/product-card";
import { useProductStore } from "@/store/product-store";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

const Recommendations = () => {
  const { recommendations, fetchRecommendations, loading, error } =
    useProductStore();
  const { user, isLoggedIn } = useUserStore();

  useEffect(() => {
    const userId = isLoggedIn && user?._id ? user._id : "guest";
    fetchRecommendations(userId);
  }, [fetchRecommendations, user?._id, isLoggedIn]);

  if (loading)
    return <p className="text-center py-4">Loading recommendations...</p>;
  if (error) {
    return (
      <p className="text-red-500 text-center py-4">
        {error.includes("503") || error.includes("Service Unavailable")
          ? "Recommendations are temporarily unavailable. Please try again later."
          : `Error: ${error}`}
      </p>
    );
  }

  return (
    <div className="w-full p-8 md:p-16  container mx-auto ">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Recommended for You
      </h2>
      {recommendations.length === 0 ? (
        <p className="text-center py-4 text-gray-600">
          No recommendations available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recommendations.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
