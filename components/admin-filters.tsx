"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Filter } from "lucide-react";

export function AdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");

  const hasFilter = searchParams.get("from") || searchParams.get("to");

  function applyFilter() {
    const params = new URLSearchParams(searchParams.toString());
    if (from) params.set("from", from);
    else params.delete("from");
    if (to) params.set("to", to);
    else params.delete("to");
    params.set("page", "1"); // reset to page 1 on filter change
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function clearFilter() {
    setFrom("");
    setTo("");
    startTransition(() => router.push(pathname));
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="from" className="text-xs text-muted-foreground">
          From
        </Label>
        <Input
          id="from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="h-8 text-sm w-36
  [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="to" className="text-xs text-muted-foreground">
          To
        </Label>
        <Input
          id="to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="h-8 text-sm w-36
  [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
      <Button
        size="sm"
        onClick={applyFilter}
        disabled={isPending}
        className="h-8 gap-1.5"
      >
        <Filter className="h-3.5 w-3.5" />
        Apply
      </Button>
      {hasFilter && (
        <Button
          size="sm"
          variant="ghost"
          onClick={clearFilter}
          disabled={isPending}
          className="h-8 gap-1.5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
      {hasFilter && (
        <span className="text-xs text-muted-foreground self-end pb-1">
          Filtered:{" "}
          {searchParams.get("from") && (
            <span className="text-foreground font-medium">
              {searchParams.get("from")}
            </span>
          )}
          {searchParams.get("from") && searchParams.get("to") && " → "}
          {searchParams.get("to") && (
            <span className="text-foreground font-medium">
              {searchParams.get("to")}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
