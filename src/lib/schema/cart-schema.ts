import { z } from "zod";

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
