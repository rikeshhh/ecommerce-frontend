"use client";
import ProtectedRoute from "@/route/protected-route/protected-route";

export default function UserHome() {
  return (
    <ProtectedRoute access="user">
      <h1>User Home</h1>
    </ProtectedRoute>
  );
}
