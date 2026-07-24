import Link from "next/link";
import { ArrowRight, Activity, Bike, Waves, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-[-10rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, #F97316, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Built for endurance athletes
        </Badge>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Stop Bonking at Mile 18.
          <br />
          <span className="text-primary">Start Finishing Strong.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          Personalized nutrition plans for runners, cyclists, swimmers and
          triathletes — built around your sport, your body, and your race
          day. No more guessing what to eat before, during, or after training.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="#pricing">
              Get my nutrition plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
          >
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Footprints className="h-4 w-4 text-primary" /> Runners
          </span>
          <span className="flex items-center gap-2">
            <Bike className="h-4 w-4 text-primary" /> Cyclists
          </span>
          <span className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-primary" /> Swimmers
          </span>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Triathletes
          </span>
        </div>
      </div>
    </section>
  );
}
