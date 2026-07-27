import { Zap } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanType } from "@/types";

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Free",
  race_day: "Race Day Kit",
  starter: "Starter",
  pro: "Pro",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({
  name,
  planType,
}: {
  name: string;
  planType: PlanType;
}) {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <p className="truncate text-sm font-semibold">
            {getGreeting()}, {name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Badge className="hidden bg-primary/15 text-primary hover:bg-primary/15 sm:inline-flex">
            {PLAN_LABELS[planType]} plan
          </Badge>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
