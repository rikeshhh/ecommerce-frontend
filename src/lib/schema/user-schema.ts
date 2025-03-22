import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().optional(),
  isBanned: z.boolean().default(false),
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
