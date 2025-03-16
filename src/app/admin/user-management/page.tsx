"use client";

import { useEffect } from "react";
import { DataTable } from "@/components/admin/data-table";
import { useUserStore } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { User } from "@/lib/schema/zod-schema";

export default function UsersTable() {
  const { items, fetchItems, loading } = useUserStore();

  useEffect(() => {
    fetchItems(1, 10);
  }, [fetchItems]);

  const handleFetchData = async (page: number, limit: number, filters: { search?: string }) => {
    try {
      const response = await fetchItems(page, limit, {
        search: filters.search || "",
      });
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const columns = [
    { key: "_id", header: "User ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "isAdmin",
      header: "Role",
      render: (user: User) => (
        <Badge variant={user.isAdmin ? "default" : "secondary"}>
          {user.isAdmin ? "Admin" : "User"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined On",
      render: (user: User) => format(new Date(user.createdAt), "LLL dd, y"),
    },
  ];

  console.log("UsersTable - Items:", items, "Loading:", loading);

  return (
    <DataTable
      title="Users"
      data={items}
      columns={columns}
      fetchData={handleFetchData}
      filterOptions={{
        statusOptions: ["Admin", "User"],
        dateField: "createdAt",
      }}
      initialPage={1}
      initialLimit={10}
    />
  );
}
