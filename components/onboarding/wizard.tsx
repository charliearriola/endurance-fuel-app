"use client";

import { useState, useTransition } from "react";
import {
  Activity,
  Bike,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { completeOnboarding, type OnboardingData } from "@/app/onboarding/actions";
import type { ExperienceLevel, Goal, Sex, Sport } from "@/types";

const TOTAL_STEPS = 3;

const SPORTS: { value: Sport; label: string; icon: typeof Footprints }[] = [
  { value: "runner", label: "Runner", icon: Footprints },
  { value: "cyclist", label: "Cyclist", icon: Bike },
  { value: "swimmer", label: "Swimmer", icon: Waves },
  { value: "triathlete", label: "Triathlete", icon: Activity },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: "beginner", label: "Beginner", desc: "New to structured training" },
  { value: "intermediate", label: "Intermediate", desc: "Training consistently for 1+ years" },
  { value: "advanced", label: "Advanced", desc: "Racing regularly, dialed-in training" },
  { value: "elite", label: "Elite", desc: "Competitive at a high level" },
];

const GOALS: { value: Goal; label: string; desc: string }[] = [
  { value: "performance", label: "Improve performance", desc: "Get faster and stronger" },
  { value: "fat_loss", label: "Fat loss", desc: "Lean out while still training hard" },
  { value: "recovery", label: "Better recovery", desc: "Feel fresher between sessions" },
  { value: "race_day", label: "Nail race day", desc: "Dial in a specific race" },
];

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "dairy_free", label: "Dairy-free" },
  { value: "nut_free", label: "Nut-free" },
];

type FormState = {
  age: string;
  sex: Sex | "";
  weight_kg: string;
  height_cm: string;
  sport: Sport | "";
  experience_level: ExperienceLevel | "";
  goal: Goal | "";
  dietary_restrictions: string[];
};

const initialState: FormState = {
  age: "",
  sex: "",
  weight_kg: "",
  height_cm: "",
  sport: "",
  experience_level: "",
  goal: "",
  dietary_restrictions: [],
};

function isStepValid(step: number, form: FormState) {
  if (step === 1) {
    return Boolean(form.age && form.sex && form.weight_kg && form.height_cm);
  }
  if (step === 2) {
    return Boolean(form.sport && form.experience_level);
  }
  return Boolean(form.goal);
}

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDietary = (value: string) =>
    setForm((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(value)
        ? prev.dietary_restrictions.filter((v) => v !== value)
        : [...prev.dietary_restrictions, value],
    }));

  const goNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    setError(null);
    const payload: OnboardingData = {
      age: Number(form.age),
      sex: form.sex as Sex,
      weight_kg: Number(form.weight_kg),
      height_cm: Number(form.height_cm),
      sport: form.sport as Sport,
      experience_level: form.experience_level as ExperienceLevel,
      goal: form.goal as Goal,
      dietary_restrictions: form.dietary_restrictions,
    };

    startTransition(async () => {
      const result = await completeOnboarding(payload);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        {step === 1 && (
          <div>
            <h1 className="text-xl font-semibold">Tell us about you</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We use this to calculate your baseline energy and macro needs.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  className="h-11"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sex">Sex</Label>
                <select
                  id="sex"
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.sex}
                  onChange={(e) => update("sex", e.target.value as Sex)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="weight_kg">Weight (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="0.1"
                  className="h-11"
                  value={form.weight_kg}
                  onChange={(e) => update("weight_kg", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="height_cm">Height (cm)</Label>
                <Input
                  id="height_cm"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="0.1"
                  className="h-11"
                  value={form.height_cm}
                  onChange={(e) => update("height_cm", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-xl font-semibold">Your sport</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              This shapes the fueling guidance you&apos;ll get.
            </p>

            <div className="mt-6">
              <span className="text-sm font-medium">Main sport</span>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SPORTS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("sport", value)}
                    className={cn(
                      "flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                      form.sport === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <span className="text-sm font-medium">Experience level</span>
              <div className="mt-2 space-y-2">
                {EXPERIENCE_LEVELS.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("experience_level", value)}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                      form.experience_level === value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-xl font-semibold">Your goal</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              We&apos;ll tailor your plan around this.
            </p>

            <div className="mt-6 space-y-2">
              {GOALS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("goal", value)}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                    form.goal === value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <span className="text-sm font-medium">
                Dietary restrictions{" "}
                <span className="text-muted-foreground">(optional)</span>
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDietary(value)}
                    className={cn(
                      "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      form.dietary_restrictions.includes(value)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={goBack}
            disabled={step === 1 || isPending}
            className={cn(step === 1 && "invisible")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              size="lg"
              onClick={goNext}
              disabled={!isStepValid(step, form)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={handleFinish}
              disabled={!isStepValid(step, form) || isPending}
            >
              {isPending ? "Saving..." : "Finish"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
