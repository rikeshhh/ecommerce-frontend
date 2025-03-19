"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchComponentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchComponent({
  searchTerm,
  onSearchChange,
}: SearchComponentProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
