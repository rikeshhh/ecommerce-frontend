"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Product, User } from "@/lib/schema/zod-schema";

interface Comment {
  _id: string;
  product: Product | null;
  user: User | null;
  comment: string;
  rating?: number;
  createdAt: string;
  isVisible: boolean;
}

const CommentsTable = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get<{ comments: Comment[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleToggleVisibility = async (
    commentId: string,
    currentVisibility: boolean
  ) => {
    setToggling((prev) => [...prev, commentId]);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments Management</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Comment</th>
                  <th className="py-2 px-4">Rating</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Visibility</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className="border-b">
                    <td className="py-2 px-4">
                      {comment.user?.name ?? "Unknown User"}
                    </td>
                    <td className="py-2 px-4">
                      {comment.product?.name ?? "Unknown Product"}
                    </td>
                    <td className="py-2 px-4">{comment.comment ?? "N/A"}</td>
                    <td className="py-2 px-4">{comment.rating ?? "N/A"}</td>
                    <td className="py-2 px-4">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {comment.isVisible ? "Visible" : "Hidden"}
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggleVisibility(comment._id, comment.isVisible)
                        }
                        disabled={toggling.includes(comment._id)}
                      >
                        {toggling.includes(comment._id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : comment.isVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                          {comment.isVisible ? "Hide" : "Show"}
                        </span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No comments found.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsTable;
