"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarouselDots from "./carousel-dots";

interface CarouselProps {
  slides: React.ReactNode[];
  autoplayDelay?: number;
}

export default function Carousel({
  slides,
  autoplayDelay = 6000,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: autoplayDelay })]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(currentIndex);
    };

    const onInit = () => {
      const snaps = emblaApi.scrollSnapList();
      setScrollSnaps(snaps);
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("init", onInit);
    emblaApi.on("reInit", onInit);

    emblaApi.reInit();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("init", onInit);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  const dotsFallback =
    slides.length > 0 && scrollSnaps.length === 0
      ? Array.from({ length: slides.length }, (_, i) => i)
      : scrollSnaps;

  return (
    <div className="md:p-12 p-4">
      <div className="relative">
        <div className="overflow-hidden rounded-xl shadow-lg" ref={emblaRef}>
          <div className="flex gap-4">{slides}</div>
        </div>

        <div className="flex items-center justify-between  gap-4 mt-6">
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={scrollPrev}
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={scrollNext}
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </Button>
          </div>
          <CarouselDots
            scrollSnaps={dotsFallback}
            selectedIndex={selectedIndex}
            onDotClick={scrollTo}
          />
        </div>
      </div>
    </div>
  );
}
