import { User } from "@/lib/schema/zod-schema";

export const dummyUsers: User[] = [
  {
    _id: "10",
    name: "John Doe",
    email: "johndoe@example.com",
    password: "securepassword",
    isAdmin: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];
