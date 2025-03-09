"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useProductStore } from "@/store/product-store";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be a positive number"),
  stock: z
    .number({ invalid_type_error: "Stock must be a number" })
    .int()
    .min(0, "Stock must be a non-negative integer"),
  image: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductForm() {
  const { isAdmin } = useUserStore();
  const { addProduct } = useProductStore();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      image: "",
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: ProductFormValues) => {
    if (!isAdmin) {
      toast.error("Unauthorized", {
        description: "Only admins can add products.",
      });
      return;
    }

    try {
      await addProduct(data);
      toast.success("Product added successfully!", {
        description: "The product has been added to the catalog.",
      });
      reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add product";
      console.error("Add product error:", errorMessage);
      setError("root", { message: errorMessage });
      toast.error("Failed to add product", {
        description: errorMessage,
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center text-red-500 py-10">
        Unauthorized: Only admins can access this page
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-lg mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
          <p className="text-sm text-blue-100">
            Fill in the details to add a new product to the catalog
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Product Name
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...register("name")}
                className={`transition-all duration-200 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                {...register("description")}
                className={`transition-all duration-200 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
                rows={4}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  {...register("price", { valueAsNumber: true })}
                  className={`transition-all duration-200 ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Enter stock quantity"
                  {...register("stock", { valueAsNumber: true })}
                  className={`transition-all duration-200 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
                />
                {errors.stock && (
                  <span className="text-red-500 text-sm">
                    {errors.stock.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">
                Image URL (Optional)
              </Label>
              <Input
                id="image"
                placeholder="Enter image URL"
                {...register("image")}
                className={`transition-all duration-200 ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
              />
              {errors.image && (
                <span className="text-red-500 text-sm">
                  {errors.image.message}
                </span>
              )}
            </div>

            {errors.root && (
              <div className="text-red-500 text-sm text-center">
                {errors.root.message}
              </div>
            )}

            <Separator className="my-4" />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProductForm;
