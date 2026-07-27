"use client";

import { useTransition } from "react";
import { Droplet, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { incrementHydration } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

export function HydrationCard({
  target,
  logged,
}: {
  target: number;
  logged: number;
}) {
  const [isPending, startTransition] = useTransition();
  const pct = target > 0 ? Math.min(100, (logged / target) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Hydration Tracker
        </h2>
        <span className="text-sm text-muted-foreground">
          {logged} / {target} glasses
        </span>
      </div>

      <Progress value={pct} className="mt-3 h-2" />

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: target }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border",
              i < logged
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            <Droplet className="h-4 w-4" />
          </span>
        ))}
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-4 w-full"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await incrementHydration();
          })
        }
      >
        <Plus className="h-4 w-4" />
        Log a glass
      </Button>
    </div>
  );
}
