import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/schema/zod-schema";

export const getUserColumns = (
  handleRoleToggle: (userId: string, currentRole: boolean) => void,
  handleDelete: (userId: string) => void,
  handleBan: (userId: string, isBanned: boolean) => void
) => [
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
      <div className="flex gap-2">
        <Button
          variant={user.isBanned ? "outline" : "secondary"}
          size="sm"
          onClick={() => handleBan(user._id, !!user.isBanned)}
          className={
            user.isBanned
              ? "hover:bg-green-600 hover:text-white transition-colors"
              : "hover:bg-yellow-600 hover:text-white transition-colors"
          }
        >
          {user.isBanned ? "Unban" : "Ban"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(user._id)}
          className="hover:bg-red-600 transition-colors"
        >
          Delete
        </Button>
      </div>
    ),
  },
];
