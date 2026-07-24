import { Calculator, CalendarRange, Flag } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    title: "Tell us about your training",
    description:
      "Your sport, race distance, training volume, and body stats. Takes about 3 minutes.",
  },
  {
    icon: CalendarRange,
    title: "Get your personalized plan",
    description:
      "A macro breakdown and 7-day fueling plan built around your training block — not a generic template.",
  },
  {
    icon: Flag,
    title: "Execute your Race Day Protocol",
    description:
      "An hour-by-hour fueling script so you know exactly what to eat and drink, and when, from start line to finish.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Most athletes train with a plan.
          <br />
          Almost none <span className="text-primary">eat</span> with one.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Bonking, cramping, and GI distress aren&apos;t bad luck — they&apos;re a
          fueling strategy that never existed. Here&apos;s how we fix that.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative rounded-2xl border border-border bg-card p-8"
          >
            <span className="absolute right-6 top-6 text-5xl font-bold text-muted/40">
              0{i + 1}
            </span>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
