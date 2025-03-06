"use client";
import { dummyUsers } from "@/data/users";
import { User } from "@/lib/schema/zod-schema";
import React, { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) throw new Error("UserContext not found!");
  return user;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = dummyUsers[0];
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
