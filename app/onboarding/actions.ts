"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceLevel, Goal, Sex, Sport } from "@/types";

export type OnboardingData = {
  age: number;
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  sport: Sport;
  experience_level: ExperienceLevel;
  goal: Goal;
  dietary_restrictions: string[];
};

export async function completeOnboarding(
  data: OnboardingData
): Promise<{ error: string } | void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      age: data.age,
      sex: data.sex,
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      sport: data.sport,
      experience_level: data.experience_level,
      goal: data.goal,
      dietary_restrictions: data.dietary_restrictions,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
