import { Product } from "@/lib/schema/zod-schema";

export const dummyProducts: Product[] = [
  {
    _id: "1",
    sku: "abc-123",
    name: "Sample Product 1",
    description: "This is a sample product.",
    price: 19.99,
    stock: 100,
    image: "https://example.com/image1.jpg",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    _id: "2",
    sku: "def-456",
    name: "Sample Product 2",
    description: "Another great product.",
    price: 29.99,
    stock: 50,
    image: "https://example.com/image2.jpg",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
];
