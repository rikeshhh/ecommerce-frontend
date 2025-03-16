"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, ShoppingCart, Heart, User, Package, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useFavoritesStore } from "@/store/favorites-store";

export const FloatingDock = ({ className }: { className?: string }) => {
  const { cart } = useCartStore();
  const { user, isLoggedIn, isAdmin, logout } = useUserStore();
  const { favorites } = useFavoritesStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoriteCount = favorites?.length || 0;
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();

  const items = [
    { title: "Home", icon: <Home className="h-5 w-5" />, href: "/" },

    {
      title: "Cart",
      icon: (
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      ),
      href: "/main/cart",
    },
    {
      title: "Favorites",
      icon: (
        <div className="relative">
          <Heart className="h-5 w-5" />
          {favoriteCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {favoriteCount}
            </span>
          )}
        </div>
      ),
      href: "/main/favourite",
    },
  ];

  const handleAuthClick = (href: string) => {
    const token = localStorage.getItem("authToken");
    const protectedRoutes = [
      "/profile",
      "/main/cart",
      "/main/favourite",
      "/user/order-history",
    ];
    if (token && protectedRoutes.includes(href)) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth/login";
          return;
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        window.location.href = "/auth/login";
        return;
      }
    }
    if (href === "/logout") {
      logout();
      localStorage.removeItem("authToken");
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className={cn("fixed top-4 z-50 max-w-md", className)}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "flex h-14 gap-3 items-center justify-center rounded-full bg-white/90 dark:bg-gray-900/90 px-4 py-2 shadow-lg backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 mx-auto",
          "md:max-w-md",
          "max-[767px]:h-12 max-[767px]:gap-2 max-[767px]:px-3"
        )}
      >
        {items.map((item) => (
          <IconContainer
            mouseX={mouseX}
            key={item.title}
            {...item}
            isActive={pathname === item.href}
          />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm max-[767px]:h-8 max-[767px]:w-8">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300 max-[767px]:h-4 max-[767px]:w-4" />
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-48">
            {isLoggedIn ? (
              <>
                <DropdownMenuLabel>
                  Welcome, {user?.name || "User"}
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link
                    href="/profile"
                    onClick={() => handleAuthClick("/profile")}
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Package className="w-4 h-4 mr-2" />
                  <Link
                    href="/user/order-history"
                    onClick={() => handleAuthClick("/user/order-history")}
                  >
                    Order History
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem>
                    <Link
                      href="/admin"
                      onClick={() => handleAuthClick("/admin")}
                    >
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleAuthClick("/logout")}>
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
      </motion.div>
    </div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isActive,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const widthTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 30, 20]
  );
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 30, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm",
          "max-[767px]:h-8 max-[767px]:w-8",
          isActive && "bg-blue-100 dark:bg-blue-900"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 8, x: "-50%" }}
              exit={{ opacity: 0, y: 10, x: "-50%" }}
              className="absolute top-full mt-2 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={cn(
            "flex items-center justify-center",
            isActive
              ? "text-blue-500 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300"
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}
