import { z } from "zod";

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
