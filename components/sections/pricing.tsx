"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { BillingPeriod, PricingTier } from "@/types";

function BillingToggle({
  period,
  onChange,
}: {
  period: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}) {
  return (
    <div className="relative inline-grid w-full max-w-xs grid-cols-2 rounded-full border border-border bg-card p-1 sm:w-auto">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-300 ease-out",
          period === "annual" && "translate-x-full"
        )}
      />
      <button
        type="button"
        onClick={() => onChange("monthly")}
        aria-pressed={period === "monthly"}
        className={cn(
          "relative z-10 flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors sm:px-5",
          period === "monthly"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        aria-pressed={period === "annual"}
        className={cn(
          "relative z-10 flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors sm:px-5",
          period === "annual"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Annual
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] font-semibold transition-colors",
            period === "annual"
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-primary/15 text-primary"
          )}
        >
          Save 50%
        </span>
      </button>
    </div>
  );
}

function PriceDisplay({
  tier,
  period,
}: {
  tier: PricingTier;
  period: BillingPeriod;
}) {
  if (tier.priceType === "free") {
    return (
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">$0</span>
        <span className="text-sm text-muted-foreground">forever</span>
      </div>
    );
  }

  if (tier.priceType === "one-time") {
    return (
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">
          ${tier.oneTimePrice}
        </span>
        <span className="text-sm text-muted-foreground">one-time</span>
      </div>
    );
  }

  if (period === "monthly") {
    return (
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">
          ${tier.monthlyPrice}
        </span>
        <span className="text-sm text-muted-foreground">/mo</span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground line-through">
          ${tier.monthlyPrice}/mo
        </span>
        <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
          50% off
        </Badge>
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight">
          ${tier.annualPrice}
        </span>
        <span className="text-sm text-muted-foreground">/yr</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        just ${(tier.annualPrice! / 12).toFixed(2)}/mo
      </p>
    </div>
  );
}

export function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Choose your fuel plan
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free. Upgrade whenever you&apos;re ready to train with a real plan.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <BillingToggle period={period} onChange={setPeriod} />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-6",
              tier.highlighted
                ? "border-primary shadow-2xl shadow-primary/20 lg:-translate-y-3"
                : "border-border"
            )}
          >
            {tier.highlighted && (
              <Badge className="mb-4 w-fit bg-primary text-primary-foreground hover:bg-primary">
                Most popular
              </Badge>
            )}

            <h3 className="text-lg font-semibold">{tier.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {tier.tagline}
            </p>

            <PriceDisplay tier={tier} period={period} />

            <Button
              asChild
              size="lg"
              className="mt-8"
              variant={
                tier.ctaVariant ?? (tier.highlighted ? "default" : "outline")
              }
            >
              <Link
                href={
                  tier.priceType === "free"
                    ? "/auth/signup"
                    : tier.priceType === "one-time"
                      ? (tier.checkoutOneTime ?? "#")
                      : period === "annual"
                        ? (tier.checkoutAnnual ?? "#")
                        : (tier.checkoutMonthly ?? "#")
                }
                target={tier.priceType !== "free" ? "_blank" : undefined}
                rel={tier.priceType !== "free" ? "noopener noreferrer" : undefined}
              >
                {tier.cta}
              </Link>
            </Button>

            {tier.note && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {tier.note}
              </p>
            )}

            <ul className="mt-8 space-y-3 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
