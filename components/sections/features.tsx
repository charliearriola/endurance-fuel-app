import {
  Calculator,
  UtensilsCrossed,
  CalendarDays,
  Flag,
  Pill,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Sport-specific macro calculator",
    description:
      "Your carb, protein, and fat targets — calculated for your sport, training load, and goals.",
  },
  {
    icon: UtensilsCrossed,
    title: "Pre / during / post workout guides",
    description:
      "Know exactly what to eat before you train, what to take on the move, and how to recover.",
  },
  {
    icon: CalendarDays,
    title: "7-day fueling plans",
    description:
      "A full week of meals and fueling mapped to your training schedule — no more guesswork.",
  },
  {
    icon: Flag,
    title: "Race Day Protocol",
    description:
      "An hour-by-hour script for race morning through the finish line, tailored to your event distance.",
  },
  {
    icon: Pill,
    title: "Supplementation guide",
    description:
      "What actually moves the needle — electrolytes, gels, caffeine timing — and what doesn't.",
  },
  {
    icon: TrendingUp,
    title: "Periodization built in",
    description:
      "Your fueling scales with your training block, from base phase to taper to race week.",
  },
];

export function Features() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to fuel like it matters
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built by endurance athletes, for endurance athletes.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
