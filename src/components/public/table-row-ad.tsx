import Image from "next/image";
import { Button } from "@/components/ui/button";

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

export default function TableRowAd({ ad }: AdProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 flex flex-col sm:flex-row items-center justify-between border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 w-24 h-24 relative mb-4 sm:mb-0">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover rounded-md"
          onError={() => console.error("Failed to load ad image")}
        />
      </div>
      <div className="flex-1 text-center sm:text-left px-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {ad.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {new Date(ad.startDate).toLocaleDateString()} -{" "}
          {new Date(ad.endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200"
        >
          <a href={ad.link} target="_blank" rel="noopener noreferrer">
            Visit
          </a>
        </Button>
      </div>
    </div>
  );
}
