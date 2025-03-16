"use client";
import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

interface LenisProviderProps {
  children: ReactNode;
}

function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default LenisProvider;
