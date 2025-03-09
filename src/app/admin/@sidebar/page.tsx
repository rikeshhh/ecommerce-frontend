"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart,
  FileText,
  ShoppingCart,
  Settings,
  LogOut,
  icons,
  Settings2,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type MenuItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const menuItems: MenuItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/user-management", icon: Users, label: "Manage Users" },
  { href: "/admin/roles", icon: Shield, label: "Roles & Permissions" },
  { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
  { href: "/admin/content", icon: FileText, label: "Content Management" },
  { href: "/admin/products", icon: FileText, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  {
    href: "/admin/add-product-form",
    icon: Settings2,
    label: "Add Product",
  },
];

export default function AdminSidebar() {
  const { logout } = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    console.log("Logging out...");
    await logout();
    console.log("Navigating to /");
    router.push("/");
  };
  return (
    <Sidebar className="">
      <SidebarHeader className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild className="flex items-center gap-2">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
