"use client";

import React, { useState } from "react";
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
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  UserIcon,
  Package,
} from "lucide-react";
import { dummyProducts } from "@/data/product";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";

const categories = Array.from(new Set(dummyProducts.map((p) => p.category)));

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useUserStore();
  const { cart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className=" w-full container mx-auto px-4  py-4 flex items-center justify-between">
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
            href="/main/product-listing"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            Product Listing
          </Link>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-200"
              >
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category}>
                  <Link
                    href={`/category/${category.toLowerCase()}`}
                    className="w-full"
                  >
                    {category}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
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
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full text-left">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category}>
                    <Link
                      href={`/category/${category.toLowerCase()}`}
                      className="w-full"
                    >
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/cart"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              <ShoppingCart className="inline w-5 h-5 mr-1" />
              Cart
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Profile
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Orders
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              Admin Dashboard
            </Link>
            <Button variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
