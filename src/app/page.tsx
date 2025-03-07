"use client";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import PublicHome from "./main/home/page";
import { useUser } from "@/context/UserContext";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import UserHome from "./user/page";

export default function Home() {
  const { user, isLoggedIn, isAdmin } = useUser();

  if (!isLoggedIn || !user) {
    return <PublicHome routes={publicRoutes} />;
  }
  if (isAdmin) {
    return <AdminDashboardPage />;
  }
  return <UserHome routes={privateRoutes} />;
}
