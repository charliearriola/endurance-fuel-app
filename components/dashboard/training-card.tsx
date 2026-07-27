"use client";

import { useState, useTransition } from "react";
import { Pencil, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logWorkout } from "@/app/dashboard/actions";
import type { WorkoutLog } from "@/types";

const SPORTS = [
  { value: "runner", label: "Running" },
  { value: "cyclist", label: "Cycling" },
  { value: "swimmer", label: "Swimming" },
  { value: "triathlete", label: "Triathlon (brick)" },
];

const INTENSITIES = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
  { value: "race", label: "Race" },
];

const PHASES = [
  { value: "base", label: "Base" },
  { value: "build", label: "Build" },
  { value: "peak", label: "Peak" },
  { value: "taper", label: "Taper" },
  { value: "recovery", label: "Recovery" },
];

const TIMES_OF_DAY = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

const LABEL_BY_VALUE = (options: { value: string; label: string }[]) =>
  Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<string, string>;

const SPORT_LABEL = LABEL_BY_VALUE(SPORTS);
const INTENSITY_LABEL = LABEL_BY_VALUE(INTENSITIES);
const PHASE_LABEL = LABEL_BY_VALUE(PHASES);

const selectClass =
  "flex h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function TrainingCard({ workout }: { workout: WorkoutLog | null }) {
  const [editing, setEditing] = useState(!workout);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await logWorkout(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setEditing(false);
      }
    });
  };

  if (workout && !editing) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Today&apos;s Training
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">
              {SPORT_LABEL[workout.sport]} — {workout.duration_minutes} min
            </p>
            <p className="text-sm text-muted-foreground">
              {INTENSITY_LABEL[workout.intensity]} ·{" "}
              {PHASE_LABEL[workout.training_phase]} phase
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Today&apos;s Training
      </h2>

      <form action={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="sport">Sport</Label>
            <select
              id="sport"
              name="sport"
              defaultValue={workout?.sport ?? ""}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Select
              </option>
              {SPORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="duration_minutes">Duration (min)</Label>
            <Input
              id="duration_minutes"
              name="duration_minutes"
              type="number"
              inputMode="numeric"
              min={1}
              required
              className="h-11"
              defaultValue={workout?.duration_minutes}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="intensity">Intensity</Label>
            <select
              id="intensity"
              name="intensity"
              defaultValue={workout?.intensity ?? ""}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Select
              </option>
              {INTENSITIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="training_phase">Training phase</Label>
            <select
              id="training_phase"
              name="training_phase"
              defaultValue={workout?.training_phase ?? "base"}
              className={selectClass}
            >
              {PHASES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="time_of_day">Time of day</Label>
            <select
              id="time_of_day"
              name="time_of_day"
              defaultValue={workout?.time_of_day ?? "morning"}
              className={selectClass}
            >
              {TIMES_OF_DAY.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          {workout && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="lg" className="flex-1" disabled={isPending}>
            {isPending ? "Saving..." : workout ? "Update training" : "Log training"}
          </Button>
        </div>
      </form>
    </div>
  );
}
