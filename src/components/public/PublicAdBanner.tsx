/* eslint-disable */

"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import BannerAd from "./banner-ad";
import TableRowAd from "./table-row-ad";
import { fetchActiveAds } from "@/lib/api/ad-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PublicAdBanner() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["publicAds"],
    queryFn: fetchActiveAds,
  });

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Contact section not found in DOM");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading ads...
        </p>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load ads", {
      description: (error as Error).message,
    });
    return null;
  }

  if (!data?.ads || data.ads.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-6 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          No ads available right now. Want to promote your brand?
        </p>
        <Button asChild variant="outline">
          <Link href="#contact" onClick={handleScrollToContact}>
            Sponsor an Ad
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full  sm:max-w-4xl mx-auto my-6 space-y-6 flex sm:flex-row flex-col container max-sm:px-4"
    >
      <Link href="#contact" onClick={handleScrollToContact}>
        Sponsor an Ad
      </Link>
      {data.ads.map((ad: any) => (
        <div key={ad._id}>
          {ad.placement === "banner" ? (
            <BannerAd ad={ad} />
          ) : (
            <TableRowAd ad={ad} />
          )}
        </div>
      ))}
    </motion.div>
  );
}
