import React from "react";

interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

export default function CarouselSlide({
  children,
  className = "",
}: CarouselSlideProps) {
  return (
    <div
      className={`flex-none w-full min-w-0 min-h-[40vh] p-6 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}
