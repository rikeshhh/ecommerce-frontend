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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Shield,
  BarChart,
  FileText,
  ShoppingCart,
  LogOut,
  Settings2,
  Settings,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";

type MenuItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const menuItems: MenuItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/user-management", icon: Users, label: "Manage Users" },
  { href: "/admin/comments-table", icon: Shield, label: "Comments" },
  { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
  {
    href: "/admin/promos",
    icon: FileText,
    label: "Promo",
  },
  { href: "/admin/products", icon: FileText, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/adManager", icon: Settings, label: "Ad Manager" },
  { href: "/admin/add-product-form", icon: Settings2, label: "Add Product" },
];

export default function AdminSidebar() {
  const { logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log("Logging out...");
    await logout();
    console.log("Navigating to /");
    router.push("/");
  };
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar
      collapsible="icon"
      className="w-[250px] data-[state=collapsed]:w-16 transition-all duration-300"
    >
      <SidebarHeader className="p-4 border-b border-gray-800">
        <h2
          className={cn(
            "text-lg font-semibold",
            isCollapsed ? "hidden" : "block"
          )}
        >
          Admin Panel
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-2",
                    pathname === item.href
                      ? "bg-gray-400 dark:bg-white text-black "
                      : "hover:bg-gray-400",
                    "data-[state=collapsed]:justify-center"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="data-[state=collapsed]:hidden">
                      {item.label}
                    </span>
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
              className={cn(
                "flex items-center gap-2 hover:bg-gray-800",
                "data-[state=collapsed]:justify-center"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="data-[state=collapsed]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
