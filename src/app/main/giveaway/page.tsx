"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function Giveaway() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date("2025-03-24T23:59:59");
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Giveaway Ended!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/giveaway/enter`,
        { email }
      );

      if (response.data.success) {
        toast.success(
          "You’re in! Check your email on March 24, 2025, for a promo code if you win!",
          { duration: 5000 }
        );
        setEmail("");
      }
    } catch (error) {
      toast.error("Failed to enter giveaway", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 w-full sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg rounded-xl overflow-hidden border-none bg-white dark:bg-gray-950 transform transition-all hover:scale-105">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <CardTitle className="text-xl  sm:text-3xl font-extrabold tracking-tight">
            🎉 Promo Code Giveaway
          </CardTitle>
          <p className="mt-2 text-sm opacity-90">Ends: March 24, 2025</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-mono text-lg font-semibold px-4 py-2 rounded-full shadow-sm">
              {timeLeft}
            </span>
          </div>

          <p className="mb-6 text-gray-700 dark:text-gray-300 text-center text-base leading-relaxed">
            Drop your email for a shot at a{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              20% off promo code
            </span>
            ! Winners revealed March 24, 2025.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ✉️
              </span>
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Entering...
                </span>
              ) : (
                "Enter Now"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            Boost your chances! Follow us on{" "}
            <a
              href="https://x.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              X
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
