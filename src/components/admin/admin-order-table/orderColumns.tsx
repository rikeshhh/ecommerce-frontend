import { Order } from "@/lib/types/order-type";
import { normalizeImageUrl } from "@/lib/utils/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  hiddenOnMobile?: boolean;
}

export const getOrderColumns = (
  handleStatusChange: (orderId: string, newStatus: string) => void
): Column<Order>[] => [
  { key: "_id", header: "Order ID", hiddenOnMobile: true },
  {
    key: "customerName",
    header: "Customer",
    render: (order: Order) => order.customerName || "Unknown",
  },
  {
    key: "products",
    header: "Products",
    render: (order: Order) => (
      <div className="space-y-1 sm:space-y-2">
        {order.products.slice(0, 2).map((p) => (
          <div key={p._id} className="flex items-center gap-2">
            {p.product ? (
              <>
                <Image
                  width={400}
                  height={400}
                  src={normalizeImageUrl(p.image || p.product?.image || "")}
                  alt={p.product.name || "Unknown Product"}
                  className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded"
                />
                <span className="text-xs sm:text-sm">
                  {p.product.name || "Unknown"} (x{p.quantity})
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm">
                Product Not Found (x{p.quantity})
              </span>
            )}
          </div>
        ))}
        {order.products.length > 2 && (
          <span className="text-xs text-muted-foreground">
            +{order.products.length - 2} more
          </span>
        )}
      </div>
    ),
  },
  {
    key: "totalAmount",
    header: "Amount",
    render: (order: Order) => `$${order.totalAmount.toLocaleString()}`,
  },
  {
    key: "status",
    header: "Status",
    render: (order: Order) => (
      <Select
        value={order.status}
        onValueChange={(value) => handleStatusChange(order._id, value)}
      >
        <SelectTrigger className="w-[100px] sm:w-[120px] h-8 text-xs sm:text-sm">
          <SelectValue>
            <Badge
              variant={
                order.status === "Processing"
                  ? "default"
                  : order.status === "Placed"
                  ? "secondary"
                  : order.status === "Shipped"
                  ? "outline"
                  : order.status === "Delivered"
                  ? "default"
                  : "destructive"
              }
            >
              {order.status}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Processing">Processing</SelectItem>
          <SelectItem value="Placed">Placed</SelectItem>
          <SelectItem value="Shipped">Shipped</SelectItem>
          <SelectItem value="Delivered">Delivered</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    key: "createdAt",
    header: "Date",
    hiddenOnMobile: true,
    render: (order: Order) => format(new Date(order.createdAt), "LLL dd, y"),
  },
];
