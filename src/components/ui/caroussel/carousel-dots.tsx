import React from "react";
import { Button } from "@/components/ui/button";

interface CarouselDotsProps {
  scrollSnaps: number[];
  selectedIndex: number;
  onDotClick: (index: number) => void;
}

export default function CarouselDots({
  scrollSnaps,
  selectedIndex,
  onDotClick,
}: CarouselDotsProps) {
  return (
    <div className="flex gap-2">
      {scrollSnaps.map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={`w-3 h-3 rounded-full p-0 ${
            index === selectedIndex ? "bg-blue-500" : "bg-gray-300"
          } hover:bg-gray-500 transition`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
