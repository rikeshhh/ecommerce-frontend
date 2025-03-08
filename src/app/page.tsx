"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { privateRoutes, publicRoutes } from "@/route/api.route";
import PublicHome from "./main/home/page";

export default function Home() {
  const { user, isLoggedIn, isAdmin } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  if (isAdmin) {
    return <div className="text-center">Redirecting to admin section...</div>;
  }

  return (
    <PublicHome
      routes={isLoggedIn ? privateRoutes : publicRoutes}
      isLoggedIn={isLoggedIn}
      user={user}
    />
  );
}
