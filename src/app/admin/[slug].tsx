import { useRouter } from "next/router";
import UsersTable from "./user-management/page";
import OrdersTable from "@/components/admin/orders-table";

export default function AdminPage() {
  const router = useRouter();
  const { slug } = router.query;

  const renderContent = () => {
    switch (slug) {
      case "user-management":
        return <UsersTable />;
      case "orders":
        return <OrdersTable />;
      case "roles":
        return <div>Roles & Permissions Page</div>;
      case "analytics":
        return <div>Analytics Page</div>;
      case "content":
        return <div>Content Management Page</div>;
      case "products":
        return <div>Products Page</div>;
      case "settings":
        return <div>Settings Page</div>;
      case "add-product-form":
        return <div>Add Product Form Page</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return <div>{renderContent()}</div>;
}
