import ContactPage from "@/components/public/conatct";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { HeroSection } from "@/components/public/hero-section";
import ProductCategory from "@/components/public/product-category";
import RecentlyAdded from "@/components/public/recently-added";
import { publicRoutes } from "@/route/api.route";
import React from "react";

export default function PublicHome({
  routes,
}: {
  routes: typeof publicRoutes;
}) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center container mx-auto">
      <HeroSection />
      <RecentlyAdded />
      <ProductCategory />
      <ContactPage />
      <FAQAccordion />
    </section>
  );
}
