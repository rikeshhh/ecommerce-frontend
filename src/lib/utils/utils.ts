import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const normalizeImageUrl = (
  image?: string | { url?: string; pathname?: string }
): string => {
  if (!image) return "/placeholder.png";

  if (typeof image === "string") {
    return image.startsWith("http://") || image.startsWith("https://")
      ? image
      : `https://c6hcsoourpmi8p32.public.blob.vercel-storage.com/${image}`;
  }

  if (typeof image === "object" && image.url) return image.url;
  if (typeof image === "object" && image.pathname)
    return `https://c6hcsoourpmi8p32.public.blob.vercel-storage.com/${image.pathname}`;

  return "/placeholder.png";
};
