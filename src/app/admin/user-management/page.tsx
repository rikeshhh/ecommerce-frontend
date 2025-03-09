"use client";

import { DataTable } from "@/components/admin/data-table";
import { useUserStore } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { User } from "@/lib/schema/zod-schema";

export default function UsersTable() {
  const { items, fetchItems, loading } = useUserStore();

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

  return (
    <DataTable
      title="Users"
      data={items}
      columns={columns}
      fetchData={fetchItems}
      loading={loading}
      filterOptions={{
        statusOptions: ["Admin", "User"],
        dateField: "createdAt",
      }}
    />
  );
}
