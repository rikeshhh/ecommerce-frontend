"use client";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  access?: "public" | "user" | "admin";
  redirectUnauthorized?: string;
  redirectUnauthenticated?: string;
}

export default function ProtectedRoute({
  children,
  access = "public",
  redirectUnauthorized = "/unauthorized",
  redirectUnauthenticated = "/login",
}: ProtectedRouteProps) {
  const user = useUserStore();
  const router = useRouter();

  if (access === "user" && !user) {
    router.push(redirectUnauthenticated);
    return <div>Loading...</div>;
  }
  if (access === "admin" && (!user || !user.isAdmin)) {
    router.push(redirectUnauthorized);
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (access === "user" && !user) {
      router.push(redirectUnauthenticated);
    } else if (access === "admin" && (!user || !user.isAdmin)) {
      router.push(redirectUnauthorized);
    } else if (access === "public" && user) {
      router.push(user.isAdmin ? "/admin" : "/user");
    }
  }, [user, access, router, redirectUnauthorized, redirectUnauthenticated]);

  return <>{children}</>;
}
