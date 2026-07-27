import { Droplet } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { MacroResult } from "@/types";

type Consumed = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

function MacroBar({
  label,
  consumed,
  target,
}: {
  label: string;
  consumed: number;
  target: number;
}) {
  const pct = target > 0 ? Math.min(100, (consumed / target) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {Math.round(consumed)}g / {Math.round(target)}g
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}

export function FuelPlanCard({
  macros,
  consumed,
  hydrationGlassesLogged,
}: {
  macros: MacroResult;
  consumed: Consumed;
  hydrationGlassesLogged: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Today&apos;s Fuel Plan
      </h2>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">
          {macros.totalCalories}
        </span>
        <span className="text-sm text-muted-foreground">kcal target</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {Math.round(consumed.calories)} kcal logged so far
      </p>

      <div className="mt-6 space-y-4">
        <MacroBar label="Protein" consumed={consumed.protein_g} target={macros.protein_g} />
        <MacroBar label="Carbs" consumed={consumed.carbs_g} target={macros.carbs_g} />
        <MacroBar label="Fat" consumed={consumed.fat_g} target={macros.fat_g} />
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Droplet className="h-4 w-4 text-primary" />
        {macros.hydration_glasses} glasses ({macros.hydration_ml}ml) target —{" "}
        {hydrationGlassesLogged} logged
      </div>

      <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
        {macros.adjustmentReason}
      </p>
    </div>
  );
}
