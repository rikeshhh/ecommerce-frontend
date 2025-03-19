"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";
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
  redirectUnauthenticated = "/", 
}: ProtectedRouteProps) {
  const { user, isLoggedIn, isAdmin, initialize } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      console.log("Initializing auth for route:", pathname);
      await initialize(); 
      setIsInitialized(true);
    };
    checkAuth();
  }, [initialize, pathname]);


  useEffect(() => {
    if (!isInitialized) return;

    console.log(
      "Checking access - isLoggedIn:",
      isLoggedIn,
      "isAdmin:",
      isAdmin,
      "path:",
      pathname
    );

    if (access === "user" && !isLoggedIn) {
      console.log(
        "User not logged in, redirecting to:",
        redirectUnauthenticated
      );
      router.push(redirectUnauthenticated);
      setIsAllowed(false);
    } else if (access === "admin" && (!isLoggedIn || !isAdmin)) {
      console.log("User not authorized, redirecting to:", redirectUnauthorized);
      router.push(redirectUnauthorized);
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  }, [
    user,
    isLoggedIn,
    isAdmin,
    access,
    router,
    redirectUnauthorized,
    redirectUnauthenticated,
    isInitialized,
  ]);


  if (!isInitialized || isAllowed === null) {
    return <div className="text-center">Checking access...</div>;
  }


  if (!isAllowed) {
    return <div className="text-center">Redirecting...</div>;
  }

 
  return <>{children}</>;
}
