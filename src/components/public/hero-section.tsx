"use client";

import Carousel from "../ui/caroussel/carousel";
import CarouselSlide from "../ui/caroussel/carousel-slide";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Feature from "./feature";

export function HeroSection() {
  const slidesData = [
    {
      gradient:
        "from-blue-900 to-blue-950 dark:from-[oklch(0.3_0.1_260)] dark:to-[oklch(0.25_0.05_260)]",
      textColor: "text-blue-600",
      hoverBg: "hover:bg-blue-100",
      title: "Explore New Arrivals!",
      description:
        "Fresh styles just dropped – elevate your wardrobe with the latest trends.",
      ctaText: "Browse Now",
      ctaLink: "/main/product-listing",
      imageSrc: "/hero-slider/hero-slide-1.jpg",
      altText: "New Arrivals Collection",
    },
    {
      gradient:
        "from-green-800 to-green-900 dark:from-[oklch(0.3_0.1_160)] dark:to-[oklch(0.25_0.05_160)]",
      textColor: "text-green-700",
      hoverBg: "hover:bg-green-100",
      title: "Save Big This Week!",
      description:
        "Enjoy up to 40% off on selected items – shop smart, save more!",
      ctaText: "Discover Deals",
      ctaLink: "/main/product-listing?category=sale",
      imageSrc: "/hero-slider/hero-slide-2.jpg",
      altText: "Weekly Deals Promotion",
    },
    {
      gradient:
        "from-purple-800 to-purple-900 dark:from-[oklch(0.3_0.1_280)] dark:to-[oklch(0.25_0.05_280)]",
      textColor: "text-purple-700",
      hoverBg: "hover:bg-purple-100",
      title: "Fast & Free Delivery!",
      description: "Get your orders delivered free on purchases over $75.",
      ctaText: "Shop Today",
      ctaLink: "/main/product-listing",
      imageSrc: "/hero-slider/hero-slide-3.jpg",
      altText: "Free Delivery Offer",
    },
  ];

  return (
    <section className="w-full relative overflow-hidden min-h-screen flex  flex-col justify-center">
      <Carousel
        slides={slidesData.map((slide, index) => (
          <CarouselSlide
            key={`slide-${index}`}
            className={`relative bg-gradient-to-r h-auto ${slide.gradient} text-white flex`}
          >
            <div className="container mx-auto sm:px-4 flex flex-col-reverse md:flex-row items-center gap-8">
              <div className=" text-left md:w-1/2">
                <h3 className="text-xl md:text-4xl font-extrabold mb-4">
                  {slide.title}
                </h3>
                <p className="sm:text-lg md:text-xl mb-6 opacity-90">
                  {slide.description}
                </p>
                <Link href={slide.ctaLink}>
                  <Button
                    size="lg"
                    className={`bg-white ${slide.textColor} ${slide.hoverBg} rounded-md px-6 py-3 font-semibold transition-all duration-300`}
                  >
                    {slide.ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="relative w-full h-64">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.altText}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </CarouselSlide>
        ))}
      />
      <Feature />
    </section>
  );
}
