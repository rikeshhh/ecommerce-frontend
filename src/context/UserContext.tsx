"use client";

import { login, logout } from "@/lib/api/auth-api";
import { User } from "@/lib/schema/zod-schema";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isLoggedIn: boolean;
  }>({
    user: null,
    isLoggedIn: false,
  });

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAuthState({ user: response.data, isLoggedIn: true });
    } catch (error) {
      console.error("Fetch user error:", error);
      setAuthState({ user: null, isLoggedIn: false });
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !authState.user) {
      fetchUserData(token);
    }
  }, [authState.user]);

  const loginHandler = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const loginResponse = await login(credentials);
      const token = loginResponse.token;
      if (!token) {
        throw new Error("No token received from login");
      }
      localStorage.setItem("authToken", token);
      await fetchUserData(token);
    } catch (error) {
      console.error("Login error:", error);
      setAuthState({ user: null, isLoggedIn: false });
      localStorage.removeItem("authToken");
      throw error;
    }
  };

  const logoutHandler = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    setAuthState({ user: null, isLoggedIn: false });
    localStorage.removeItem("authToken");
  };

  return (
    <UserContext.Provider
      value={{
        user: authState.user,
        isLoggedIn: authState.isLoggedIn,
        isAdmin: authState.user?.isAdmin || false,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
