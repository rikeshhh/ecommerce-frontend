"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

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
        setTimeLeft("Giveaway ended!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setTimeLeft(`${days}d ${hours}h left`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000 * 60);
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
          "You’re in! Check your email later for a promo code if you win!"
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
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Promo Code Giveaway</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{timeLeft} - timeleft</p>
          <p className="mb-4 text-gray-600">
            Enter your email for a chance to win a 20% off promo code! Winners
            announced March 24, 2025.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entering..." : "Enter Giveaway"}
            </Button>
          </form>
          <p className="mb-4 text-gray-600">
            Follow us on{" "}
            <a
              href="https://x.com/yourhandle"
              target="_blank"
              className="text-blue-600"
            >
              X
            </a>{" "}
            and enter your email for a chance to win!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
