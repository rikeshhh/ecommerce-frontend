"use client";
// import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/footer/Footer";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import Header from "@/components/common/header/Header";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {!isAdminRoute && <Header />}

            <main className="min-h-screen flex flex-col justify-center">
              {children}
            </main>

            {!isAdminRoute && <Footer />}
            <Toaster />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
