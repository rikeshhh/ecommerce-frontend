import { Cart } from "@/lib/schema/zod-schema";

export const dummyCart: Cart = {
  _id: "200",
  user: "10",
  items: [
    { product: "1", quantity: 3 },
    { product: "2", quantity: 1 },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};
