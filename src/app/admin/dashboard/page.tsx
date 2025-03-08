"use client";
import React from "react";
import { privateRoutes } from "@/route/api.route";
import ProtectedRoute from "@/route/protected-route/protected-route";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute access="admin">
      <h1>Admin Dashboard</h1>
      <ul>
        <li>Create Product: {privateRoutes.products.create}</li>
        <li>View Orders: {privateRoutes.orders.create}</li>
        <li>Logout: {privateRoutes.auth.logout}</li>
      </ul>
    </ProtectedRoute>
  );
}
