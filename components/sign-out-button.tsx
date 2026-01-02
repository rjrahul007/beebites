"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={cn(
        "flex w-full items-center justify-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm cursor-pointer disabled:opacity-50",
        className
      )}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
