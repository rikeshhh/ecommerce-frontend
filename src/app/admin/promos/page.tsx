"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, RefreshCcw } from "lucide-react";
import { format, addDays } from "date-fns";
import axios from "axios";
import { useProductStore } from "@/store/product-store";

export default function PromoManagement() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("10");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [category, setCategory] = useState("");
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, categories, fetchProducts, fetchCategories, loading } =
    useProductStore();

  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const generatePromoCode = () => {
    const prefixes = ["SAVE", "FLASH", "SUMMER", "WINTER", "DEAL"];
    const suffix = Math.floor(Math.random() * 90 + 10); // 10-99
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    setCode(`${randomPrefix}${suffix}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Please log in as admin");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promo/create`,
        {
          code,
          discount: parseFloat(discount),
          startDate,
          endDate,
          productIds: productIds.length ? productIds : undefined,
          category: category || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Promo code "${code}" created successfully!`);
        setCode("");
        setDiscount("10");
        setStartDate(new Date());
        setEndDate(addDays(new Date(), 7));
        setProductIds([]);
        setCategory("");
      }
    } catch (error) {
      console.error("Error creating promo:", error);
      toast.error("Failed to create promo code", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Promo Code</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <p className="text-gray-500">Loading products and categories...</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Promo Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="e.g., SAVE10"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePromoCode}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Discount (%)
              </label>
              <Input
                id="discount"
                type="number"
                placeholder="e.g., 10"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="1"
                max="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(day) => day && setStartDate(day)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(day) => day && setEndDate(day)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label
                htmlFor="productIds"
                className="block text-sm font-medium text-gray-700"
              >
                Products (optional)
              </label>
              <Select
                onValueChange={(value) =>
                  setProductIds((prev) =>
                    prev.includes(value) ? prev : [...prev, value]
                  )
                }
                disabled={loading || products.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      products.length
                        ? "Select products"
                        : "No products available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {productIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {productIds.map((id) => {
                    const product = products.find((p) => p._id === id);
                    return (
                      <span
                        key={id}
                        className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                      >
                        {product?.name || id}
                        <button
                          type="button"
                          onClick={() =>
                            setProductIds(
                              productIds.filter((pid) => pid !== id)
                            )
                          }
                          className="ml-2 text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category (optional)
              </label>
              <Select
                onValueChange={setCategory}
                value={category}
                disabled={loading || categories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categories.length
                        ? "Select a category"
                        : "No categories available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Creating..." : "Create Promo Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
