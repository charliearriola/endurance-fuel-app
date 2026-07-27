import type {
  Goal,
  Intensity,
  MacroResult,
  MealSlot,
  MealTiming,
  MealType,
  Profile,
  Sport,
  TimeOfDay,
  TrainingPhase,
} from "@/types";

export type WorkoutInput = {
  sport: Sport;
  duration_minutes: number;
  intensity: Intensity;
  training_phase: TrainingPhase;
  time_of_day: TimeOfDay;
};

const ACTIVITY_MULTIPLIER: Record<NonNullable<Profile["experience_level"]>, number> = {
  beginner: 1.375,
  intermediate: 1.55,
  advanced: 1.725,
  elite: 1.9,
};

const INTENSITY_MULTIPLIER: Record<Intensity, number> = {
  easy: 0.8,
  moderate: 1.0,
  hard: 1.2,
  race: 1.5,
};

// kcal burned per minute per kg of bodyweight, at "moderate" intensity.
const SPORT_CALORIE_COEFFICIENT: Record<Exclude<Sport, "triathlete">, number> = {
  runner: 0.0133,
  cyclist: 0.01,
  swimmer: 0.015,
};

// ml of sweat lost per minute, at "moderate" intensity.
const SPORT_SWEAT_RATE: Record<Exclude<Sport, "triathlete">, number> = {
  runner: 1.2,
  cyclist: 0.9,
  swimmer: 0.7,
};

const CARB_RATIO_BY_PHASE: Record<TrainingPhase, number> = {
  base: 0.45,
  build: 0.5,
  peak: 0.55,
  taper: 0.45,
  recovery: 0.4,
};

function averageOf(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** kcal/min/kg for a sport, averaging the three disciplines for triathletes. */
function calorieCoefficient(sport: Sport): number {
  if (sport === "triathlete") {
    return averageOf(Object.values(SPORT_CALORIE_COEFFICIENT));
  }
  return SPORT_CALORIE_COEFFICIENT[sport];
}

/** ml/min/kg... actually ml/min sweat rate, same triathlete-averaging rule. */
function sweatRate(sport: Sport): number {
  if (sport === "triathlete") {
    return averageOf(Object.values(SPORT_SWEAT_RATE));
  }
  return SPORT_SWEAT_RATE[sport];
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function calculateBMR(profile: Profile): number {
  const weight = profile.weight_kg ?? 0;
  const height = profile.height_cm ?? 0;
  const age = profile.age ?? 0;
  const base = 10 * weight + 6.25 * height - 5 * age;

  // Mifflin-St Jeor only defines male/female terms. For "other" we average
  // the two offsets (+5 and -161) rather than pick a side.
  if (profile.sex === "male") return base + 5;
  if (profile.sex === "female") return base - 161;
  return base + (5 + -161) / 2;
}

function calculateWorkoutCalories(workout: WorkoutInput | undefined, weightKg: number): number {
  if (!workout) return 0;
  const coefficient = calorieCoefficient(workout.sport);
  const intensityMult = INTENSITY_MULTIPLIER[workout.intensity];
  return workout.duration_minutes * coefficient * weightKg * intensityMult;
}

function primaryGoal(profile: Profile): Goal {
  return profile.goals[0] ?? "performance";
}

function applyGoalAdjustment(
  tdee: number,
  workoutCalories: number,
  goal: Goal
): { totalCalories: number; reason: string } {
  switch (goal) {
    case "fat_loss":
      return {
        totalCalories: (tdee + workoutCalories) * 0.85,
        reason:
          "Fat loss goal: a 15% deficit applied on top of your training expenditure, sized to spare performance.",
      };
    case "recovery":
      return {
        totalCalories: tdee * 1.1,
        reason:
          "Recovery goal: a 10% surplus over baseline maintenance to support tissue repair and adaptation.",
      };
    case "race_day":
      return {
        totalCalories: tdee + workoutCalories * 1.1,
        reason:
          "Race Day Protocol: maximum carb load and energy availability for peak performance.",
      };
    case "performance":
    default:
      return {
        totalCalories: tdee + workoutCalories,
        reason:
          "Performance goal: matching intake to your full energy expenditure so you can train and recover at capacity.",
      };
  }
}

function calculateMacroSplit(
  totalCalories: number,
  weightKg: number,
  phase: TrainingPhase
): { protein_g: number; carbs_g: number; fat_g: number } {
  const protein_g = weightKg * 2.0;
  const proteinCalories = protein_g * 4;

  const carbRatio = CARB_RATIO_BY_PHASE[phase];
  const carbs_g = (totalCalories * carbRatio) / 4;
  const carbCalories = carbs_g * 4;

  const fatCalories = Math.max(totalCalories - proteinCalories - carbCalories, 0);
  const fat_g = fatCalories / 9;

  return {
    protein_g: round1(protein_g),
    carbs_g: round1(carbs_g),
    fat_g: round1(fat_g),
  };
}

function calculateHydration(
  weightKg: number,
  workout: WorkoutInput | undefined
): { hydration_ml: number; hydration_glasses: number } {
  const base_ml = weightKg * 35;

  let workout_ml = 0;
  if (workout) {
    const rate = sweatRate(workout.sport);
    const intensityMult = INTENSITY_MULTIPLIER[workout.intensity];
    workout_ml = workout.duration_minutes * rate * intensityMult;
  }

  const hydration_ml = Math.round(base_ml + workout_ml);
  const hydration_glasses = Math.ceil(hydration_ml / 250);

  return { hydration_ml, hydration_glasses };
}

// Assumed clock time training starts, per time-of-day bucket. The schema has
// no exact workout time, only a coarse morning/afternoon/evening bucket, so
// meal times are computed as offsets from these anchors rather than a real
// scheduled time.
const TIME_OF_DAY_ANCHOR_MINUTES: Record<TimeOfDay, number> = {
  morning: 7 * 60,
  afternoon: 15 * 60,
  evening: 18 * 60,
};

function formatClockTime(minutesFromMidnight: number): string {
  const normalized = ((Math.round(minutesFromMidnight) % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function mealFromShare(
  key: MealType,
  label: string,
  sortMinutes: number,
  share: number,
  totalCalories: number,
  macros: { protein_g: number; carbs_g: number; fat_g: number },
  note?: string
): MealSlot {
  return {
    key,
    label,
    time: formatClockTime(sortMinutes),
    sortMinutes: ((Math.round(sortMinutes) % 1440) + 1440) % 1440,
    calories: Math.round(totalCalories * share),
    protein_g: round1(macros.protein_g * share),
    carbs_g: round1(macros.carbs_g * share),
    fat_g: round1(macros.fat_g * share),
    note,
  };
}

function buildMealTiming(
  workout: WorkoutInput | undefined,
  totalCalories: number,
  macros: { protein_g: number; carbs_g: number; fat_g: number }
): MealTiming {
  const m = (
    key: MealType,
    label: string,
    sortMinutes: number,
    share: number,
    note?: string
  ) => mealFromShare(key, label, sortMinutes, share, totalCalories, macros, note);

  if (!workout) {
    return {
      breakfast: m("breakfast", "Breakfast", 7 * 60 + 30, 0.25),
      pre_workout: null,
      during_workout: null,
      post_workout: null,
      lunch: m("lunch", "Lunch", 12 * 60 + 30, 0.3),
      dinner: m("dinner", "Dinner", 19 * 60, 0.3),
      snacks: [
        m("snack", "Mid-morning snack", 10 * 60, 0.075),
        m("snack", "Afternoon snack", 15 * 60 + 30, 0.075),
      ],
    };
  }

  const anchor = TIME_OF_DAY_ANCHOR_MINUTES[workout.time_of_day];
  const isLongSession = workout.duration_minutes >= 60;
  const duringShare = isLongSession ? 0.05 : 0;
  const duringNote = "Sip 30-60g carbs/hour via gel or sports drink";

  if (workout.time_of_day === "morning") {
    return {
      breakfast: m(
        "breakfast",
        "Light breakfast",
        anchor - 120,
        0.12,
        "Light and easy to digest — training in 2h"
      ),
      pre_workout: m(
        "pre_workout",
        "Pre-workout snack",
        anchor - 30,
        0.05,
        "Quick carbs, 30 min before training"
      ),
      during_workout: isLongSession
        ? m("during_workout", "During workout", anchor + workout.duration_minutes / 2, duringShare, duringNote)
        : null,
      post_workout: m(
        "post_workout",
        "Post-workout meal",
        anchor + workout.duration_minutes + 30,
        0.2 + (isLongSession ? 0 : 0.05),
        "30-45 min window — high protein and carbs"
      ),
      lunch: m("lunch", "Lunch", 12 * 60 + 30, 0.28),
      dinner: m("dinner", "Dinner", 19 * 60, 0.3),
      snacks: [],
    };
  }

  if (workout.time_of_day === "afternoon") {
    return {
      breakfast: m("breakfast", "Breakfast", 7 * 60 + 30, 0.15),
      lunch: m(
        "lunch",
        "Strong lunch",
        anchor - 180,
        0.28,
        "Bigger meal, 3h before training"
      ),
      pre_workout: m(
        "pre_workout",
        "Pre-workout snack",
        anchor - 60,
        0.07,
        "Light carbs, 1h before training"
      ),
      during_workout: isLongSession
        ? m("during_workout", "During workout", anchor + workout.duration_minutes / 2, duringShare, duringNote)
        : null,
      post_workout: m(
        "post_workout",
        "Post-workout meal",
        anchor + workout.duration_minutes + 30,
        0.2 + (isLongSession ? 0 : 0.05),
        "30-45 min window — high protein and carbs"
      ),
      dinner: m("dinner", "Dinner", 19 * 60 + 30, 0.25),
      snacks: [],
    };
  }

  // evening
  return {
    breakfast: m("breakfast", "Breakfast", 7 * 60 + 30, 0.2),
    lunch: m("lunch", "Lunch", 12 * 60 + 30, 0.32),
    pre_workout: m(
      "pre_workout",
      "Afternoon snack",
      anchor - 60,
      0.1,
      "Light carbs, 1h before training"
    ),
    during_workout: isLongSession
      ? m("during_workout", "During workout", anchor + workout.duration_minutes / 2, duringShare, duringNote)
      : null,
    post_workout: m(
      "post_workout",
      "Post-workout dinner",
      anchor + workout.duration_minutes + 30,
      0.33 + (isLongSession ? 0 : 0.05),
      "Doubles as dinner — 30-45 min window, high protein and carbs"
    ),
    dinner: null,
    snacks: [],
  };
}

/** Flattens mealTiming's named slots + snacks into one chronological list. */
export function flattenMealTiming(mealTiming: MealTiming): MealSlot[] {
  const slots = [
    mealTiming.breakfast,
    mealTiming.pre_workout,
    mealTiming.during_workout,
    mealTiming.post_workout,
    mealTiming.lunch,
    mealTiming.dinner,
    ...mealTiming.snacks,
  ].filter((slot): slot is MealSlot => slot !== null);

  return slots.sort((a, b) => a.sortMinutes - b.sortMinutes);
}

export function calculateDailyMacros(
  profile: Profile,
  workout?: WorkoutInput
): MacroResult {
  const weightKg = profile.weight_kg ?? 0;
  const experienceLevel = profile.experience_level ?? "intermediate";
  const phase = workout?.training_phase ?? "base";
  const goal = primaryGoal(profile);

  const bmr = calculateBMR(profile);
  const tdee = bmr * ACTIVITY_MULTIPLIER[experienceLevel];
  const workoutCalories = calculateWorkoutCalories(workout, weightKg);
  const { totalCalories, reason } = applyGoalAdjustment(tdee, workoutCalories, goal);
  const macros = calculateMacroSplit(totalCalories, weightKg, phase);
  const hydration = calculateHydration(weightKg, workout);
  const mealTiming = buildMealTiming(workout, totalCalories, macros);

  return {
    totalCalories: Math.round(totalCalories),
    protein_g: macros.protein_g,
    carbs_g: macros.carbs_g,
    fat_g: macros.fat_g,
    hydration_ml: hydration.hydration_ml,
    hydration_glasses: hydration.hydration_glasses,
    mealTiming,
    workoutCalories: Math.round(workoutCalories),
    adjustmentReason: reason,
  };
}
