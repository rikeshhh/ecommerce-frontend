import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
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

export const getCommentColumns = (
  handleToggleVisibility: (
    commentId: string,
    currentVisibility: boolean
  ) => void,
  handleDeleteComment: (commentId: string) => void,
  toggling: string[]
) => [
  {
    key: "user",
    header: "User",
    render: (comment: Comment) => comment.user?.name ?? "Unknown User",
  },
  {
    key: "product",
    header: "Product",
    render: (comment: Comment) => comment.product?.name ?? "Unknown Product",
  },
  {
    key: "comment",
    header: "Comment",
    render: (comment: Comment) => comment.comment ?? "N/A",
  },
  {
    key: "rating",
    header: "Rating",
    hiddenOnMobile: true,
    render: (comment: Comment) => comment.rating ?? "N/A",
  },
  {
    key: "createdAt",
    header: "Date",
    hiddenOnMobile: true,
    render: (comment: Comment) =>
      comment.createdAt
        ? new Date(comment.createdAt).toLocaleDateString()
        : "N/A",
  },
  {
    key: "isVisible",
    header: "Visibility",
    render: (comment: Comment) => (comment.isVisible ? "Visible" : "Hidden"),
  },
  {
    key: "actions",
    header: "Actions",
    render: (comment: Comment) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleToggleVisibility(comment._id, comment.isVisible)}
          disabled={toggling.includes(comment._id)}
        >
          {toggling.includes(comment._id) ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : comment.isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {comment.isVisible ? "Hide" : "Show"}
          </span>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteComment(comment._id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Delete</span>
        </Button>
      </div>
    ),
  },
];
