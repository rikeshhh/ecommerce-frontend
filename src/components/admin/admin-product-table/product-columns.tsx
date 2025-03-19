import { format, isValid } from "date-fns";
import { Product } from "@/lib/types";

export const getProductColumns = () => [
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
    render: (product: Product) => `${product.price.toLocaleString()}`,
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
];
