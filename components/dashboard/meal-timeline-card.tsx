"use client";

import { useState, useTransition } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logMeal } from "@/app/dashboard/actions";
import type { MealSlot } from "@/types";

function MealRow({ entry, logged }: { entry: MealSlot; logged: boolean }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await logMeal(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  };

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{entry.label}</p>
          <p className="text-xs text-muted-foreground">
            {entry.time} · {entry.calories} kcal · P {entry.protein_g}g · C{" "}
            {entry.carbs_g}g · F {entry.fat_g}g
          </p>
          {entry.note && (
            <p className="mt-0.5 text-xs text-muted-foreground">{entry.note}</p>
          )}
        </div>

        {logged ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            <Check className="h-3 w-3" />
            Logged
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setOpen((v) => !v)}
          >
            <Plus className="h-3.5 w-3.5" />
            Log meal
          </Button>
        )}
      </div>

      {open && !logged && (
        <form
          action={handleSubmit}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <input type="hidden" name="meal_type" value={entry.key} />
          <Input
            name="description"
            placeholder="What did you eat?"
            className="h-11 flex-1"
          />
          <Input
            name="calories_kcal"
            type="number"
            inputMode="numeric"
            placeholder="kcal"
            className="h-11 sm:w-24"
          />
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function MealTimelineCard({
  entries,
  loggedMealTypes,
}: {
  entries: MealSlot[];
  loggedMealTypes: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Meal Timeline
      </h2>
      <div className="mt-2 divide-y divide-border">
        {entries.map((entry, i) => (
          <MealRow
            key={`${entry.key}-${i}`}
            entry={entry}
            logged={loggedMealTypes.includes(entry.key)}
          />
        ))}
      </div>
    </div>
  );
}
