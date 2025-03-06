import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string(),
  sku: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().min(0, "Stock must be a positive number"),
  image: z.string().url().optional(),
  category: z.string().min(1, "Category is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const OrderSchema = z.object({
  _id: z.string(),
  user: z.string(),
  products: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  status: z.string().default("Pending"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export const CartSchema = z.object({
  _id: z.string(),
  user: z.string(),
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Cart = z.infer<typeof CartSchema>;
