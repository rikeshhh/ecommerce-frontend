"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Product, User } from "@/lib/schema/cart-schema";

interface Comment {
  _id: string;
  product: Product | null;
  user: User | null;
  comment: string;
  rating?: number;
  createdAt: string;
  isVisible: boolean;
}

interface CommentsTableLogic {
  comments: Comment[];
  loading: boolean;
  toggling: string[];
  handleFetchData: (
    page: number,
    limit: number,
    filters: { search?: string; createdAt?: { from?: string; to?: string } }
  ) => Promise<{ items: Comment[]; totalItems: number; totalPages: number }>;
  handleToggleVisibility: (
    commentId: string,
    currentVisibility: boolean
  ) => Promise<void>;
  handleDeleteComment: (commentId: string) => Promise<void>;
}

export function useCommentsTableLogic(): CommentsTableLogic {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get<{
          comments: Comment[];
          totalItems: number;
          totalPages: number;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });
        setComments(response.data.comments ?? []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        toast.error("Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleFetchData = async (
    page: number,
    limit: number,
    filters: { search?: string; createdAt?: { from?: string; to?: string } }
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get<{
        comments: Comment[];
        totalItems: number;
        totalPages: number;
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit,
          search: filters.search,
          dateFrom: filters.createdAt?.from,
          dateTo: filters.createdAt?.to,
        },
      });
      setComments(response.data.comments ?? []);
      return {
        items: response.data.comments ?? [],
        totalItems: response.data.totalItems ?? 0,
        totalPages: response.data.totalPages ?? 1,
      };
    } catch (err) {
      console.error("Error fetching comments:", err);
      toast.error("Failed to fetch comments");
      return { items: [], totalItems: 0, totalPages: 1 };
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (
    commentId: string,
    currentVisibility: boolean
  ) => {
    setToggling((prev) => [...prev, commentId]);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, isVisible: !currentVisibility }
            : comment
        )
      );
      toast.success(
        `Comment ${currentVisibility ? "hidden" : "shown"} successfully`
      );
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to toggle visibility";
      toast.error(errorMessage);
    } finally {
      setToggling((prev) => prev.filter((id) => id !== commentId));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted successfully");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to delete comment";
      toast.error(errorMessage);
    }
  };

  return {
    comments,
    loading,
    toggling,
    handleFetchData,
    handleToggleVisibility,
    handleDeleteComment,
  };
}
