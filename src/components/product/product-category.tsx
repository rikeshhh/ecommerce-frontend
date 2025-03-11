"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Clothing", slug: "clothing" },
  { name: "Books", slug: "books" },
  { name: "Sunt in sit consequ", slug: "Sunt in sit consequ" },
];

export default function ProductCategory() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link href={`/category/${category.slug}`} key={category.slug}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore {category.name.toLowerCase()} products
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
