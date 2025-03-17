"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ShoppingCart, LogOut, UserIcon, Package } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useUserStore();
  const { cart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          E-Shop
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Home
          </Link>
          <Link
            href="/main/favourite"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Favorite
          </Link>
          <Link
            href="/main/cart"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 flex items-center"
          >
            <ShoppingCart className="inline w-5 h-5 mr-1" />
            Cart
            {totalItems > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <UserIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel>
                    Welcome, {user?.name || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="w-4 h-4 mr-2" />
                    <Link href="/user/order-history">Order History</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/auth/register">Signup</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white dark:bg-gray-900 px-4 py-4 border-t border-gray-200 dark:border-gray-700"
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/main/favourite"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Favorite
            </Link>
            <Link
              href="/main/cart"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="inline w-5 h-5 mr-1" />
              Cart
              {totalItems > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/user/order-history"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Order History
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full text-gray-700 dark:text-gray-200 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
