"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Intensity, MealType, Sport, TimeOfDay, TrainingPhase } from "@/types";

async function requireUserId() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return { supabase, userId: user.id };
}

export async function logWorkout(formData: FormData) {
  const { supabase, userId } = await requireUserId();

  const sport = String(formData.get("sport")) as Sport;
  const duration_minutes = Number(formData.get("duration_minutes"));
  const intensity = String(formData.get("intensity")) as Intensity;
  const training_phase = String(formData.get("training_phase")) as TrainingPhase;
  const time_of_day = String(formData.get("time_of_day")) as TimeOfDay;

  if (!sport || !duration_minutes || !intensity || !training_phase || !time_of_day) {
    return { error: "Please fill in every field." };
  }

  const { error } = await supabase.from("workout_logs").upsert(
    {
      user_id: userId,
      logged_date: new Date().toISOString().slice(0, 10),
      sport,
      duration_minutes,
      intensity,
      training_phase,
      time_of_day,
    },
    { onConflict: "user_id,logged_date" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
}

export async function logMeal(formData: FormData) {
  const { supabase, userId } = await requireUserId();

  const meal_type = String(formData.get("meal_type")) as MealType;
  const description = String(formData.get("description") ?? "").trim() || null;
  const caloriesRaw = formData.get("calories_kcal");
  const calories_kcal = caloriesRaw ? Number(caloriesRaw) : null;

  const { error } = await supabase.from("nutrition_logs").insert({
    user_id: userId,
    logged_date: new Date().toISOString().slice(0, 10),
    meal_type,
    description,
    calories_kcal,
    source: "manual",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
}

export async function incrementHydration() {
  const { supabase, userId } = await requireUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("hydration_logs")
    .select("glasses_logged")
    .eq("user_id", userId)
    .eq("logged_date", today)
    .maybeSingle();

  const nextCount = (existing?.glasses_logged ?? 0) + 1;

  const { error } = await supabase.from("hydration_logs").upsert(
    {
      user_id: userId,
      logged_date: today,
      glasses_logged: nextCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,logged_date" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
}
