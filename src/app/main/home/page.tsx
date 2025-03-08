import ContactPage from "@/components/public/conatct";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { HeroSection } from "@/components/public/hero-section";
import ProductCategory from "@/components/public/product-category";
import RecentlyAdded from "@/components/public/recently-added";
import { User } from "@/lib/schema/zod-schema";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import React from "react";
interface HomePageProps {
  routes: typeof publicRoutes | typeof privateRoutes;
  isLoggedIn: boolean;
  user: User | null;
}
export default function PublicHome({
  routes,
  isLoggedIn,
  user,
}: HomePageProps) {
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
