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

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().optional(),
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  favorites: z.array(z.string()).optional(),
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
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  image: z.instanceof(File).optional().nullable(),
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

export const LocationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});
export type LocationFormValues = z.infer<typeof LocationSchema>;
