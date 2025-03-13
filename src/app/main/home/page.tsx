"use client";

import { useEffect } from "react";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { HeroSection } from "@/components/public/hero-section";
import RecentlyAdded from "@/components/public/recently-added";
import { useFavoritesStore } from "@/store/favorites-store";
import ProductCategory from "@/components/product/product-category";
import ContactPage from "@/components/public/conatct";
import Recommendations from "../recommended-products/page";

export default function PublicHome() {
  const { initialize } = useFavoritesStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <HeroSection />
      <RecentlyAdded />
      <ProductCategory />
      <Recommendations />
      <ContactPage />
      <FAQAccordion />
    </section>
  );
}
