"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/public/hero-section";
import RecentlyAdded from "@/components/public/recently-added";
import { useFavoritesStore } from "@/store/favorites-store";
import ProductCategory from "@/components/product/product-category";
import Recommendations from "../recommended-products/page";
import { useProductStore } from "@/store/product-store";
import ProductListingPage from "../product-listing/page";
import { FAQAccordion } from "@/components/public/faq-accordion";
import Giveaway from "../giveaway/page";
import ContactPage from "@/components/public/conatct";

export default function PublicHome() {
  const { initialize } = useFavoritesStore();
  const { reset } = useProductStore();
  useEffect(() => {
    initialize();
    return () => {
      reset();
    };
  }, [initialize, reset]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <HeroSection />
      <RecentlyAdded />
      <Giveaway />
      <ProductListingPage />
      <ProductCategory />
      <Recommendations />
      <ContactPage />
      <FAQAccordion />
    </section>
  );
}
