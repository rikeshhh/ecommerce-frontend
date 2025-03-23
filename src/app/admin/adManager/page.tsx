/* eslint-disable */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddAdForm from "@/components/admin/admin-ad/add-ad-form";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const fetchAds = async (page: number) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found. Please log in.");

  const response = await axios.get(`${apiUrl}/api/ads`, {
    params: { limit: 2, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Fetched ads data:", response.data);
  return response.data;
};

const approveAd = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found. Please log in.");

  const response = await axios.patch(
    `${apiUrl}/api/ads/${id}`,
    { status: "active" },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteAd = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found. Please log in.");

  const response = await axios.delete(`${apiUrl}/api/ads/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default function AdManager() {
  const { isAdmin } = useUserStore();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ads", currentPage],
    queryFn: () => fetchAds(currentPage),
    enabled: isAdmin,
  });

  const approveMutation = useMutation({
    mutationFn: approveAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentPage] });
      toast.success("Ad approved successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to approve ad";
      console.error("Error approving ad:", errorMessage);
      toast.error("Failed to approve ad", { description: errorMessage });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads", currentPage] });
      toast.success("Ad deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to delete ad";
      console.error("Error deleting ad:", errorMessage);
      toast.error("Failed to delete ad", { description: errorMessage });
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAdmin) return <p>Admin access required</p>;
  if (isLoading) return <p>Loading ads...</p>;
  if (error) return <p>Error loading ads: {(error as Error).message}</p>;

  const totalPages = data?.totalPages || 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Ads</h1>
      <AddAdForm />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Ads</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.ads.length === 0 ? (
            <p>No ads yet</p>
          ) : (
            <>
              <ul className="space-y-4">
                {data?.ads.map((ad: any) => (
                  <li
                    key={ad._id}
                    className="flex justify-between items-center border p-4 rounded"
                  >
                    <div>
                      <p>
                        <strong>{ad.title}</strong> ({ad.placement})
                      </p>
                      <p>Status: {ad.status}</p>
                      <p>
                        Link:{" "}
                        <a
                          href={ad.link}
                          target="_blank"
                          className="text-blue-600"
                        >
                          {ad.link}
                        </a>
                      </p>
                      <p>
                        Duration: {new Date(ad.startDate).toLocaleDateString()}{" "}
                        - {new Date(ad.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {ad.status === "pending" && (
                        <Button
                          onClick={() => handleApprove(ad._id)}
                          variant="outline"
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(ad._id)}
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    showFirstLast={true}
                    siblingCount={1}
                    className="text-sm"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
