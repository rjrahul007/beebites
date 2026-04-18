"use client";

import type React from "react";
import { FcGoogle } from "react-icons/fc";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLayout from "@/components/page-layout";
import { Eye, EyeOff } from "lucide-react";
import BrandMark from "@/components/brand-mark";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsGoogleLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          {/* Brand mark */}
          <BrandMark signin={true} />

          {/* Card */}
          <Card className="bg-card border-border rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/50 rounded-xl transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-11 bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary/50 rounded-xl transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-150"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl">
                    <span className="mt-px shrink-0">⚠</span>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-11 mt-1 rounded-xl bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground text-sm font-bold tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-150"
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-widest">
                    or
                  </span>
                </div>
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl bg-muted border-border hover:bg-accent hover:border-border text-foreground text-sm font-medium active:scale-[0.98] transition-all duration-150"
              >
                <FcGoogle className="h-4 w-4 shrink-0" />
                {isGoogleLoading ? "Connecting…" : "Continue with Google"}
              </Button>

              {/* Sign up link */}
              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
