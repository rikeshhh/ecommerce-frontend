"use client";
import { dummyUsers } from "@/data/users";
import { User } from "@/lib/schema/zod-schema";
import React, { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = dummyUsers.length > 0 ? dummyUsers[0] : null;
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
