"use client";

import { DataTable } from "@/components/admin/Data-Table/data-table";
import { useUsersTableLogic } from "./useUsersTableLogic";
import { getUserColumns } from "./user-columns";

export default function UsersTable() {
  const {
    items,
    loading,
    handleFetchData,
    handleRoleToggle,
    handleDelete,
    handleBan,
  } = useUsersTableLogic();

  const columns = getUserColumns(handleRoleToggle, handleDelete, handleBan);

  console.log("UsersTable - Items:", items, "Loading:", loading);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-10 text-center tracking-tight">
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
