"use client";

import { useUserStore } from "@/store/userStore";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import PublicHome from "./main/home/page";

export default function Home() {
  const { user, isLoggedIn, isAdmin } = useUserStore();

  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return (
    <PublicHome
      routes={isLoggedIn ? privateRoutes : publicRoutes}
      isLoggedIn={isLoggedIn}
      user={user}
    />
  );
}
