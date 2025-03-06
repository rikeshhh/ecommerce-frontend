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
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import { dummyProducts } from "@/data/product";

const categories = Array.from(new Set(dummyProducts.map((p) => p.category)));

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <DropdownMenu>
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
          </DropdownMenu>
          <Link
            href="/main/cart"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            <ShoppingCart className="inline w-5 h-5 mr-1" />
            Cart
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href="/auth/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/auth/register">Signup</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/admin">Admin Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
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
