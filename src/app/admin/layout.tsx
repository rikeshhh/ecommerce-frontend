"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "@/route/protected-route/protected-route";
import AdminSidebar from "./@sidebar/page";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute access="admin">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <aside>
            <AdminSidebar />
          </aside>
          <main className="p-6 bg-gray-200 flex-1">
            <SidebarTrigger className="mb-4" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
