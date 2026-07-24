import { redirect } from "next/navigation";
import { CalendarClock, Plus, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanType, Profile } from "@/types";

const PLAN_LABELS: Record<PlanType, string> = {
  free: "Free",
  race_day: "Race Day Kit",
  starter: "Starter",
  pro: "Pro",
};

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

  const displayName = profile.full_name?.split(" ")[0] || "Athlete";

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" fill="currentColor" />
            </span>
            <span>Hola, {displayName}</span>
          </div>

          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Tu Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aquí está el resumen de tu plan de nutrición.
            </p>
          </div>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
            Plan {PLAN_LABELS[profile.plan_type]}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarClock className="h-4 w-4 text-primary" />
              Tu Plan de Hoy
            </div>
            <div className="mt-4 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                Todavía no tienes un plan de fueling generado para hoy.
                Vuelve pronto — estamos construyendo esta sección.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Acciones rápidas
            </p>
            <Button size="lg" className="mt-4 w-full">
              <Plus className="h-4 w-4" />
              Registrar Entrenamiento de Hoy
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
