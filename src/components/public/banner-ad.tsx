import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdProps {
  ad: {
    _id: string;
    imageUrl: string;
    title: string;
    link: string;
    startDate: string;
    endDate: string;
  };
}

export default function BannerAd({ ad }: AdProps) {
  return (
    <div
      className="relative w-64 h-48 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 group"
      style={{
        backgroundImage: `url(${ad.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col justify-between h-full p-3 text-white">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold drop-shadow-md truncate max-w-[70%]">
            {ad.title}
          </h3>
          <span className="text-xs bg-gray-800/70 px-1.5 py-0.5 rounded-full drop-shadow">
            Ad
          </span>
        </div>
        <div className="text-xs opacity-80 drop-shadow">
          {new Date(ad.startDate).toLocaleDateString()} -{" "}
          {new Date(ad.endDate).toLocaleDateString()}
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-2 bg-white/90 text-gray-900 hover:bg-white/100 hover:text-gray-900 border-none font-medium rounded-full px-4 py-1 transition-transform duration-300 group-hover:scale-105"
        >
          <Link href={ad.link} target="_blank" rel="noopener noreferrer">
            Learn More
          </Link>
        </Button>
      </div>
    </div>
  );
}
