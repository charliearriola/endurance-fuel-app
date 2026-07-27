import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateDailyMacros, flattenMealTiming, type WorkoutInput } from "@/lib/macros";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TrainingCard } from "@/components/dashboard/training-card";
import { FuelPlanCard } from "@/components/dashboard/fuel-plan-card";
import { MealTimelineCard } from "@/components/dashboard/meal-timeline-card";
import { HydrationCard } from "@/components/dashboard/hydration-card";
import type { NutritionLog, Profile, WorkoutLog } from "@/types";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const today = todayISO();

  const [{ data: workout }, { data: nutritionLogs }, { data: hydration }] =
    await Promise.all([
      supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("logged_date", today)
        .maybeSingle<WorkoutLog>(),
      supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("logged_date", today)
        .returns<NutritionLog[]>(),
      supabase
        .from("hydration_logs")
        .select("glasses_logged")
        .eq("user_id", user.id)
        .eq("logged_date", today)
        .maybeSingle<{ glasses_logged: number }>(),
    ]);

  const workoutInput: WorkoutInput | undefined = workout
    ? {
        sport: workout.sport,
        duration_minutes: workout.duration_minutes,
        intensity: workout.intensity,
        training_phase: workout.training_phase,
        time_of_day: workout.time_of_day,
      }
    : undefined;

  const macros = calculateDailyMacros(profile, workoutInput);
  const mealEntries = flattenMealTiming(macros.mealTiming);

  const logs = nutritionLogs ?? [];
  const consumed = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories_kcal ?? 0),
      protein_g: acc.protein_g + (log.protein_g ?? 0),
      carbs_g: acc.carbs_g + (log.carbs_g ?? 0),
      fat_g: acc.fat_g + (log.fat_g ?? 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
  const loggedMealTypes = Array.from(
    new Set(
      logs
        .map((log) => log.meal_type)
        .filter((t): t is NonNullable<typeof t> => t !== null)
    )
  );

  const displayName = profile.full_name?.split(" ")[0] || "Athlete";

  return (
    <div className="min-h-screen">
      <DashboardHeader name={displayName} planType={profile.plan_type} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <TrainingCard workout={workout ?? null} />
          <FuelPlanCard
            macros={macros}
            consumed={consumed}
            hydrationGlassesLogged={hydration?.glasses_logged ?? 0}
          />
          <MealTimelineCard entries={mealEntries} loggedMealTypes={loggedMealTypes} />
          <HydrationCard
            target={macros.hydration_glasses}
            logged={hydration?.glasses_logged ?? 0}
          />
        </div>
      </main>
    </div>
  );
}
