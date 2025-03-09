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
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

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
  category: z.string().min(1, "Category is required"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Image must be less than 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, or GIF images are allowed"
    ),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const { isAdmin } = useUserStore();
  const { addProduct } = useProductStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      image: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: ProductFormValues) => {
    console.log("Form submitted with data:", data);
    if (!isAdmin) {
      toast.error("Unauthorized", {
        description: "Only admins can add products.",
      });
      console.log("Blocked: User is not admin");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("category", data.category);
      if (file) formData.append("image", file);

      console.log("FormData prepared:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Calling addProduct...");
      const productData = await addProduct(formData);
      console.log("addProduct response:", productData);

      toast.success("Product added successfully!", {
        description: "The product has been added to the catalog.",
        action: { label: "View", onClick: () => console.log("View product") },
      });
      reset();
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setFile(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add product";
      console.error("Add product error:", errorMessage);
      setError("root", { message: errorMessage });
      toast.error("Failed to add product", { description: errorMessage });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      setValue("image", selectedFile, { shouldValidate: true });
      console.log("File selected:", selectedFile.name);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 py-10"
      >
        Unauthorized: Only admins can access this page
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4"
    >
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Add New Product
          </CardTitle>
          <p className="text-sm text-indigo-100 mt-1">
            Create a new product for your catalog
          </p>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Product Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Wireless Headphones"
                {...register("name")}
              />
              {errors.name && (
                <motion.span className="text-red-500 text-sm">
                  {errors.name.message}
                </motion.span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                {...register("description")}
                rows={4}
              />
              {errors.description && (
                <motion.span className="text-red-500 text-sm">
                  {errors.description.message}
                </motion.span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </Label>
              <Input
                id="category"
                placeholder="e.g., Electronics"
                {...register("category")}
              />
              {errors.category && (
                <motion.span className="text-red-500 text-sm">
                  {errors.category.message}
                </motion.span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 29.99"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <motion.span className="text-red-500 text-sm">
                    {errors.price.message}
                  </motion.span>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="e.g., 100"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <motion.span className="text-red-500 text-sm">
                    {errors.stock.message}
                  </motion.span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Product Image (Optional)
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:text-white"
              />
              {errors.image && (
                <motion.span className="text-red-500 text-sm">
                  {errors.image.message}
                </motion.span>
              )}
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4"
                >
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                    onError={() => setImagePreview(null)}
                  />
                </motion.div>
              )}
            </div>

            {errors.root && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {errors.root.message}
              </motion.div>
            )}

            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

            <Button type="submit" disabled={isSubmitting} className="w-full">
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
    </motion.div>
  );
}
