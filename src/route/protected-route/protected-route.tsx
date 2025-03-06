"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ReactNode } from "react";

export default function ProtectedRoute({
  children,
  redirectUnauthorized = "/unauthorized",
  redirectUnauthenticated = "/login",
}: {
  children: ReactNode;
  redirectUnauthorized?: string;
  redirectUnauthenticated?: string;
}) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(redirectUnauthenticated);
    } else if (!user.isAdmin) {
      router.push(redirectUnauthorized);
    }
  }, [user, router, redirectUnauthorized, redirectUnauthenticated]);

  if (!user || !user.isAdmin) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
