"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

const LocationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type LocationFormValues = z.infer<typeof LocationSchema>;

interface ShippingInfoProps {
  user: { location?: LocationFormValues } | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export function ShippingInfo({
  user,
  dialogOpen,
  setDialogOpen,
}: ShippingInfoProps) {
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      address: user?.location?.address || "",
      city: user?.location?.city || "",
      state: user?.location?.state || "",
      postalCode: user?.location?.postalCode || "",
      country: user?.location?.country || "",
    },
  });

  React.useEffect(() => {
    if (dialogOpen && user?.location) {
      locationForm.reset({
        address: user.location.address,
        city: user.location.city,
        state: user.location.state,
        postalCode: user.location.postalCode,
        country: user.location.country,
      });
    }
  }, [dialogOpen, user, locationForm]);

  const handleLocationSubmit = async (data: LocationFormValues) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        { location: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      useUserStore.getState().updateLocation(data);
      toast.success("Location updated successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update location", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Something went wrong",
      });
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Shipping Information</h2>
      {user?.location ? (
        <div className="text-muted-foreground">
          <p>{user.location.address}</p>
          <p>
            {user.location.city}, {user.location.state}{" "}
            {user.location.postalCode}
          </p>
          <p>{user.location.country}</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-blue-600 hover:underline text-sm mt-2">
                Edit shipping address
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Shipping Address</DialogTitle>
              </DialogHeader>
              <Form {...locationForm}>
                <form
                  onSubmit={locationForm.handleSubmit(handleLocationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={locationForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Springfield" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="IL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="62701" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="text-muted-foreground">
          <p>No shipping address saved. Waiting for live location...</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-blue-600 hover:underline text-sm mt-2">
                Add shipping address
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Shipping Address</DialogTitle>
              </DialogHeader>
              <Form {...locationForm}>
                <form
                  onSubmit={locationForm.handleSubmit(handleLocationSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={locationForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Springfield" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="IL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="62701" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={locationForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
