"use client";

import { useEffect } from "react";
import { DataTable } from "@/components/admin/data-table";
import { useUserStore } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { User } from "@/lib/schema/zod-schema";
import { toast } from "sonner";

export default function UsersTable() {
  const {
    items,
    fetchItems,
    loading,
    totalItems,
    currentPage,
    totalPages,
    updateUserRole,
    deleteUser,
  } = useUserStore();

  useEffect(() => {
    if (items.length === 0) {
      console.log("Fetching initial users...");
      fetchItems(1, 10);
    }
  }, [fetchItems, items.length]);

  const handleFetchData = async (
    page: number,
    limit: number,
    filters: {
      search?: string;
      createdAt?: { from?: string; to?: string };
      role?: string;
    }
  ) => {
    try {
      console.log("Fetching data with:", { page, limit, filters });
      await fetchItems(page, limit, filters);
      return { items, totalItems, currentPage, totalPages };
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error instanceof Error) {
        toast.error("Failed to fetch users", { description: error.message });
      } else {
        toast.error("Failed to fetch users");
      }
      throw error;
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: boolean) => {
    try {
      await updateUserRole(userId, !currentRole);
      toast.success(`User role updated to ${!currentRole ? "Admin" : "User"}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Failed to update role", { description: error.message });
      } else {
        toast.error("Failed to update role");
      }
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        toast.success("User deleted successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Failed to delete user", { description: error.message });
        } else {
          toast.error("Failed to delete user");
        }
      }
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
        <Badge
          variant={user.isAdmin ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleRoleToggle(user._id, !!user.isAdmin)}
        >
          {user.isAdmin ? "Admin" : "User"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined On",
      render: (user: User) => format(new Date(user.createdAt), "LLL dd, y"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(user._id)}
          className="hover:bg-red-600 transition-colors"
        >
          Delete
        </Button>
      ),
    },
  ];

  console.log("UsersTable - Items:", items, "Loading:", loading);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight">
          Manage Users
        </h1>
        <div className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 transition-all hover:shadow-xl">
          {loading && items.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                />
              </svg>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
