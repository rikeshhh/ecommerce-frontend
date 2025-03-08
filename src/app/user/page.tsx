"use client";
import ProtectedRoute from "@/route/protected-route/protected-route";

interface UserHomeProps {
  routes: any;
}

export default function UserHome({ routes }: UserHomeProps) {
  return (
    <ProtectedRoute access="user">
      <h1>User Home</h1>
    </ProtectedRoute>
  );
}
