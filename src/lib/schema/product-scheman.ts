import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Product ID must be a valid MongoDB ObjectId",
  }),
  sku: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  image: z.instanceof(File).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
