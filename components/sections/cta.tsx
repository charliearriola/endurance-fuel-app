import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card px-8 py-16 text-center sm:px-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next race deserves a real fueling plan.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Stop leaving your nutrition to chance. Get a plan built for your
          sport, your training, and your race day.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
          <Link href="#pricing">
            Get my nutrition plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
