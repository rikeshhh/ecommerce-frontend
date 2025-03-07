"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { login } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { login } = useUser();
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Login successful!", {
        description: "Welcome back!",
      });
      router.push("/");
      console.log("Login successful - context updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      console.error("Login error:", errorMessage);
      setError("root", { message: errorMessage });
      toast.error("Login failed", {
        description: errorMessage,
      });
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-md p-6 shadow-md bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome Back
      </h2>
      <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-300">
        Sign in to your account
      </p>

      <form className="my-6" onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="you@example.com"
            {...register("email")}
            className={errors.email && "border-red-500"}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password && "border-red-500"}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </LabelInputContainer>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-black text-white dark:bg-zinc-900"
        >
          {isSubmitting ? "Signing in..." : "Sign In →"}
        </Button>
      </form>

      <div className="border-t border-neutral-300 dark:border-neutral-700 my-6"></div>

      <div className="flex flex-col space-y-3">
        <OAuthButton icon={IconBrandGithub} text="GitHub" />
        <OAuthButton icon={IconBrandGoogle} text="Google" />
        <OAuthButton icon={IconBrandOnlyfans} text="OnlyFans" />
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const OAuthButton = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <Button
    variant="outline"
    className="flex items-center justify-center space-x-2 w-full"
  >
    <Icon className="h-5 w-5" />
    <span>{text}</span>
  </Button>
);
