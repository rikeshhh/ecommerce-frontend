"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { reverseGeocode } from "@/lib/geocode";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const LocationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type LocationFormValues = z.infer<typeof LocationSchema>;

interface OrderPayload {
  products: { product: string; quantity: number }[];
  totalAmount: number;
  paymentMethodId: string;
  location: LocationFormValues;
  promoCode?: string;
}

const CheckoutForm: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = promoApplied ? (subtotal * promoApplied.discount) / 100 : 0;
  const totalPrice = subtotal - discount;

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

  useEffect(() => {
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

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const liveLocation = await reverseGeocode(latitude, longitude);
          useUserStore.getState().updateLiveLocation(liveLocation);

          const token = localStorage.getItem("authToken");
          if (token) {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
            await axios.put(
              url,
              { location: liveLocation },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        } catch (error) {
          console.error("Live location update failed:", error);
          if (axios.isAxiosError(error)) {
            toast.error("Failed to update live location", {
              description:
                error.response?.status === 404
                  ? "Endpoint not found."
                  : error.response?.data?.message || error.message,
            });
          } else {
            toast.error("Geolocation error", {
              description: (error as Error).message,
            });
          }
        }
      },
      (error) => {
        toast.error(`Geolocation error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

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

  const handleApplyPromo = async () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promo/validate`,
        {
          code: promoCode,
          orders: [
            {
              products: cart.map((item) => ({
                product: item._id,
                quantity: item.quantity,
              })),
            },
          ],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPromoApplied({
          code: promoCode,
          discount: response.data.promo.discount,
        });
        setPromoError(null);
        toast.success(`Promo code "${promoCode}" applied!`);
      } else {
        setPromoError(response.data.message || "Invalid promo code");
      }
    } catch (error) {
      setPromoError("Failed to validate promo code");
      console.error("Promo validation error:", error);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError(null);
    toast.info("Promo code removed");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/auth/login?returnUrl=/checkout");
      return;
    }

    if (!user.location) {
      toast.error("Please add a shipping address");
      setDialogOpen(true);
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    if (totalPrice <= 0) {
      toast.error("Cart total must be greater than zero");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) throw new Error(error.message);

      const orderData: OrderPayload = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: Number(item.quantity),
        })),
        totalAmount: Number(totalPrice),
        paymentMethodId: paymentMethod!.id,
        location: user.location,
        promoCode: promoApplied?.code, 
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );
        if (confirmError) throw new Error(confirmError.message);
        clearCart();
        toast.success("Your order has been successful!");
        router.push(
          `/order-confirmation?orderId=${response.data.paymentIntentId}`
        );
      } else {
        clearCart();
        toast.success("Your order has been successfully processed!");
        router.push(`/order-confirmation?orderId=${response.data._id}`);
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      if (axios.isAxiosError(error)) {
        toast.error("Order Failed", {
          description:
            error.code === "ERR_NETWORK"
              ? "Cannot connect to the server."
              : error.response?.data?.message || "Please try again later",
        });
      } else {
        toast.error("Unexpected Error", {
          description: (error as Error).message || "Something went wrong",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="md:max-w-4xl w-full mx-auto p-6 container">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between py-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>रु{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>रु{subtotal.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({promoApplied.code}):</span>
              <span>-रु{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>रु{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Promo Code</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code (e.g., SAVE10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={!!promoApplied}
            className="flex-1"
          />
          {promoApplied ? (
            <Button variant="outline" onClick={handleRemovePromo}>
              Remove
            </Button>
          ) : (
            <Button onClick={handleApplyPromo}>Apply</Button>
          )}
        </div>
        {promoError && (
          <p className="text-red-500 text-sm mt-2">{promoError}</p>
        )}
      </div>
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="border p-2 rounded">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      </div>
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handlePlaceOrder}
        disabled={isProcessing || cart.length === 0}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
};

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
