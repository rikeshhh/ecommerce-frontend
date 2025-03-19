"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

export function useUsersTableLogic() {
  const {
    items,
    fetchItems,
    loading,
    totalItems,
    currentPage,
    totalPages,
    updateUserRole,
    deleteUser,
    banUser,
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

  const handleBan = async (userId: string, isBanned: boolean) => {
    if (
      confirm(
        `Are you sure you want to ${isBanned ? "unban" : "ban"} this user?`
      )
    ) {
      try {
        await banUser(userId, !isBanned);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to ${isBanned ? "unban" : "ban"} user`, {
            description: error.message,
          });
        } else {
          toast.error(`Failed to ${isBanned ? "unban" : "ban"} user`);
        }
      }
    }
  };

  return {
    items,
    loading,
    handleFetchData,
    handleRoleToggle,
    handleDelete,
    handleBan,
  };
}
