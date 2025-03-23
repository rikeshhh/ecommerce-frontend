"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { HeroSection } from "@/components/public/hero-section";
import RecentlyAdded from "@/components/public/recently-added";
import Giveaway from "./main/giveaway/page";
import ProductListingPage from "./main/product-listing/page";
import ProductCategory from "@/components/product/product-category";
import Recommendations from "./main/recommended-products/page";
import ContactPage from "@/components/public/conatct";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { useFavoritesStore } from "@/store/favorites-store";
import { useProductStore } from "@/store/product-store";
import PublicAdBanner from "@/components/public/PublicAdBanner";

export default function Home() {
  const { isAdmin } = useUserStore();
  const { initialize } = useFavoritesStore();
  const { reset } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
    if (isAdmin) {
      router.push("/admin");
    }
    return () => {
      reset();
    };
  }, [isAdmin, router, initialize, reset]);

  if (isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Redirecting to Admin...
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <HeroSection />
      <PublicAdBanner />
      <RecentlyAdded />
      <Giveaway />
      <ProductListingPage />
      <ProductCategory />
      <Recommendations />
      <section id="conatct" className="w-full">
        <ContactPage />
      </section>
      <FAQAccordion />
    </section>
  );
}
