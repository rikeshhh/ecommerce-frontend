"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

const adSchema = z
  .object({
    title: z.string().min(1, "Ad title is required"),
    link: z.string().url("Must be a valid URL").min(1, "Ad link is required"),
    placement: z.enum(["banner", "table-row"], {
      required_error: "Placement is required",
    }),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
    image: z
      .instanceof(File)
      .refine((file) => file !== undefined, "Image is required")
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Image must be less than 5MB"
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only JPEG, PNG, or GIF images are allowed"
      ),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type AdFormValues = z.infer<typeof adSchema>;

const addAd = async (formData: FormData) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(`${apiUrl}/api/ads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create ad: ${errorText}`);
  }
  return response.json();
};

export default function AddAdForm() {
  const { isAdmin } = useUserStore();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      link: "",
      placement: "banner",
      startDate: "",
      endDate: "",
      image: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const placement = watch("placement");

  const mutation = useMutation({
    mutationFn: addAd,
    onSuccess: (newAd) => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad added successfully!", {
        description: "The ad has been added and is pending approval.",
        action: {
          label: "View",
          onClick: () => console.log("View ad:", newAd.ad?._id),
        },
      });
      reset();
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add ad";
      console.error("Add ad error:", errorMessage);
      setError("root", { message: errorMessage });
      toast.error("Failed to add ad", { description: errorMessage });
    },
  });

  const onSubmit = async (data: AdFormValues) => {
    console.log("Form submitted with data:", data);
    if (!isAdmin) {
      toast.error("Unauthorized", {
        description: "Only admins can add ads.",
      });
      console.log("Blocked: User is not admin");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication error", {
        description: "No token found. Please log in again.",
      });
      console.log("Blocked: No token available");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link);
      formData.append("placement", data.placement);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      if (data.image) formData.append("image", data.image);

      console.log("FormData prepared:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Calling addAd via mutation...");
      mutation.mutate(formData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to prepare form data";
      console.error("Form preparation error:", errorMessage);
      setError("root", { message: errorMessage });
      toast.error("Form error", { description: errorMessage });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      setValue("image", selectedFile, { shouldValidate: true });
      console.log("File selected:", selectedFile.name);
    }
  };

  const handlePlacementChange = (value: "banner" | "table-row") => {
    setValue("placement", value, { shouldValidate: true });
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
          <CardTitle className="text-2xl font-bold tracking-tight">
            Add New Ad
          </CardTitle>
          <p className="text-sm text-indigo-100 mt-1">
            Create a new advertisement for the website
          </p>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ad Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Summer Sale Banner"
                {...register("title")}
              />
              {errors.title && (
                <motion.span className="text-red-500 text-sm">
                  {errors.title.message}
                </motion.span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="link"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ad Link
              </Label>
              <Input
                id="link"
                placeholder="e.g., https://example.com"
                {...register("link")}
              />
              {errors.link && (
                <motion.span className="text-red-500 text-sm">
                  {errors.link.message}
                </motion.span>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="placement"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Placement
              </Label>
              <Select value={placement} onValueChange={handlePlacementChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="table-row">Table Row</SelectItem>
                </SelectContent>
              </Select>
              {errors.placement && (
                <motion.span className="text-red-500 text-sm">
                  {errors.placement.message}
                </motion.span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date
                </Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <motion.span className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </motion.span>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date
                </Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <motion.span className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </motion.span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Ad Image
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
                  <Image
                    src={imagePreview}
                    width={300}
                    height={300}
                    alt="Ad preview"
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

            <Button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="w-full"
            >
              {isSubmitting || mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding Ad...
                </>
              ) : (
                "Add Ad"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
