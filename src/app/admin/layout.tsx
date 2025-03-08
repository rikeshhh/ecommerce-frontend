"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "@/route/protected-route/protected-route";

type AdminLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function AdminLayout({ children, sidebar }: AdminLayoutProps) {
  return (
    <ProtectedRoute access="admin">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <aside className="w-[250px] text-white bg-gray-800">{sidebar}</aside>
          <main className="p-6 bg-gray-200 flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
