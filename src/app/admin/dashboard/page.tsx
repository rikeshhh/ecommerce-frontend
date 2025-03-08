"use client";

import { useUserStore } from "@/store/userStore";

export default function DashboardPage() {
  const { user } = useUserStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user?.name || "Admin"}!</p>
      <p>This is your admin dashboard. Add widgets or stats here.</p>
    </div>
  );
}
