export type Sport = "runner" | "cyclist" | "swimmer" | "triathlete";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type Goal = "performance" | "fat_loss" | "recovery" | "race_day";
export type Sex = "male" | "female" | "other";
export type PlanType = "free" | "race_day" | "starter" | "pro";
export type BudgetLevel = "low" | "medium" | "high";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  age: number | null;
  sex: Sex | null;
  weight_kg: number | null;
  height_cm: number | null;
  sports: Sport[];
  experience_level: ExperienceLevel | null;
  goals: Goal[];
  dietary_restrictions: string[];
  disliked_foods: string[];
  favorite_foods: string[];
  diet_strictness: number;
  cheat_meals_per_week: number;
  budget_level: BudgetLevel;
  plan_type: PlanType;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Intensity = "easy" | "moderate" | "hard" | "race";
export type TrainingPhase = "base" | "build" | "peak" | "taper" | "recovery";
export type TimeOfDay = "morning" | "afternoon" | "evening";

export type WorkoutLog = {
  id: string;
  user_id: string;
  logged_date: string;
  sport: Sport;
  duration_minutes: number;
  intensity: Intensity;
  training_phase: TrainingPhase;
  time_of_day: TimeOfDay;
  notes: string | null;
  created_at: string;
};

export type MealType =
  | "breakfast"
  | "pre_workout"
  | "during_workout"
  | "post_workout"
  | "lunch"
  | "dinner"
  | "snack";

export type NutritionLogSource = "manual" | "plan" | "photo_analysis";

export type NutritionLog = {
  id: string;
  user_id: string;
  logged_date: string;
  meal_type: MealType | null;
  description: string | null;
  calories_kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  photo_url: string | null;
  is_cheat_meal: boolean;
  source: NutritionLogSource;
  created_at: string;
};

export type HydrationLog = {
  id: string;
  user_id: string;
  logged_date: string;
  glasses_logged: number;
  updated_at: string;
};

export type MealSlot = {
  key: MealType;
  label: string;
  time: string;
  sortMinutes: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  note?: string;
};

export type MealTiming = {
  breakfast: MealSlot | null;
  pre_workout: MealSlot | null;
  during_workout: MealSlot | null;
  post_workout: MealSlot | null;
  lunch: MealSlot | null;
  dinner: MealSlot | null;
  snacks: MealSlot[];
};

export type MacroResult = {
  totalCalories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  hydration_ml: number;
  hydration_glasses: number;
  mealTiming: MealTiming;
  workoutCalories: number;
  adjustmentReason: string;
};

export type BillingPeriod = "monthly" | "annual";

export type PricingTier = {
  name: string;
  tagline: string;
  priceType: "free" | "one-time" | "subscription";
  oneTimePrice?: number;
  monthlyPrice?: number;
  annualPrice?: number;
  features: string[];
  cta: string;
  ctaVariant?: "default" | "outline";
  note?: string;
  highlighted?: boolean;
};
