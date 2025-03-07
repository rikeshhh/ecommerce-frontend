"use client";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/route/protected-route/protected-route";

interface UserHomeProps {
  routes: any;
}

export default function UserHome({ routes }: UserHomeProps) {
  const user = useUser();
  return (
    <ProtectedRoute access="user">
      <h1>User Home</h1>
      {user && <p>Welcome, {user.isAdmin}</p>}
    </ProtectedRoute>
  );
}
