"use client";

import { useCallback, useState } from "react";
import { useProductStore } from "@/store/product-store";
import { DataTable } from "@/components/admin/Data-Table/data-table";
import { format, isValid } from "date-fns";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
});

type ProductFormValues = z.infer<typeof ProductSchema>;

export default function ProductsTable() {
  const { products, fetchProducts, deleteProduct, updateProduct } =
    useProductStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (process.env.NODE_ENV === "development") {
    console.log("Products:", products);
    products.forEach((product, index) => {
      console.log(`Product ${index} createdAt:`, product.createdAt);
    });
  }

  const handleFetchData = useCallback(
    async (
      page: number,
      limit: number,
      filters: { search?: string; createdAt?: { from?: Date; to?: Date } }
    ) => {
      console.log("handleFetchData called:", { page, limit, filters });
      try {
        const response = await fetchProducts({
          page,
          limit,
          search: filters.search,
          from: filters.createdAt?.from
            ? filters.createdAt.from.toISOString()
            : undefined,
          to: filters.createdAt?.to
            ? filters.createdAt.to.toISOString()
            : undefined,
        });
        console.log("handleFetchData response:", response);
        return response;
      } catch (error) {
        console.error("handleFetchData error:", error);
        return { items: [], totalItems: 0, totalPages: 1 };
      }
    },
    [fetchProducts]
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      await fetchProducts({ page: 1, limit: 10 });
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product. Try again.");
    }
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      sku: "",
      stock: 0,
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      price: product.price,
      sku: product.sku,
      stock: product.stock,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct._id, data);
      toast.success("Product updated successfully");
      setDialogOpen(false);
      await fetchProducts({ page: 1, limit: 10 });
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Failed to update product. Try again.");
    }
  };

  const columns = [
    {
      key: "image",
      header: "Image",
      isImage: true,
      render: (product: Product) => (
        <span className="truncate max-w-[150px] sm:max-w-none">
          {product.name}
        </span>
      ),
    },
    {
      key: "_id",
      header: "Product ID",
      hiddenOnMobile: true,
    },
    {
      key: "sku",
      header: "SKU",
      hiddenOnMobile: true,
    },
    {
      key: "price",
      header: "Price",
      render: (product: Product) => `$${product.price.toLocaleString()}`,
    },
    {
      key: "stock",
      header: "Stock",
    },
    {
      key: "createdAt",
      header: "Added On",
      hiddenOnMobile: true,
      render: (product: Product) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `Rendering createdAt for ${product._id}:`,
            product.createdAt
          );
        }
        const date = new Date(product.createdAt);
        return isValid(date) ? format(date, "LLL dd, y") : "Invalid Date";
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (product: Product) => (
        <div className="flex space-x-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(product)}
              >
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product #{product._id.slice(-6)}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SKU" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter stock quantity"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(product._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      key={products.length}
      title="Products"
      data={products}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{ dateField: "createdAt" }}
      initialPage={1}
      initialLimit={10}
    />
  );
}
