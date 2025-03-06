"use client";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import PublicHome from "./main/home/page";
import { useUser } from "@/context/UserContext";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import UserHome from "./user/page";

export default function Home() {
  const user = useUser();
  console.log("Home user:", user);

  if (!user) return <PublicHome routes={publicRoutes} />;
  if (user.isAdmin === true) return <AdminDashboardPage />;
  if (user.isAdmin === false) return <UserHome routes={privateRoutes} />;
  return <PublicHome routes={publicRoutes} />;
}
