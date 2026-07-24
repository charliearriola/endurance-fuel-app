export type Sport = "runner" | "cyclist" | "swimmer" | "triathlete";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type Goal = "performance" | "fat_loss" | "recovery" | "race_day";
export type Sex = "male" | "female" | "other";
export type PlanType = "free" | "race_day" | "starter" | "pro";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  age: number | null;
  sex: Sex | null;
  weight_kg: number | null;
  height_cm: number | null;
  sport: Sport | null;
  experience_level: ExperienceLevel | null;
  goal: Goal | null;
  dietary_restrictions: string[];
  plan_type: PlanType;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
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
