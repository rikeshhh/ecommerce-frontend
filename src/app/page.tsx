"use client";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import { useUser } from "@/context/UserContext";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import PublicHome from "./main/home/page";

export default function Home() {
  const user = useUser();
  if (user?.isAdmin) {
    return <AdminDashboardPage routes={privateRoutes} user={user} />;
  }
  return <PublicHome routes={publicRoutes} />;
}
