import type { PricingTier } from "@/types";

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    tagline: "Try the basics, no strings attached.",
    priceType: "free",
    features: [
      "Basic macro calculator",
      "No sport personalization",
      "Community resources",
    ],
    cta: "Get started free",
    ctaVariant: "outline",
    note: "No credit card required",
  },
  {
    name: "Race Day Kit",
    tagline: "Everything you need for one race.",
    priceType: "one-time",
    oneTimePrice: 15,
    features: [
      "Complete Race Day Protocol",
      "Hour-by-hour fueling script",
      "Hydration & electrolyte cheat sheet",
      "Lifetime access",
    ],
    cta: "Buy once — $15",
    ctaVariant: "outline",
  },
  {
    name: "Starter",
    tagline: "Ongoing fueling guidance for your sport.",
    priceType: "subscription",
    monthlyPrice: 9,
    annualPrice: 54,
    features: [
      "Sport-specific macro calculator",
      "Pre / during / post workout guides",
      "7-day fueling plans",
      "Email support",
    ],
    cta: "Start Starter",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    tagline: "The full system for serious athletes.",
    priceType: "subscription",
    monthlyPrice: 19,
    annualPrice: 114,
    features: [
      "Everything in Starter",
      "Race Day Protocol included",
      "Full training-block periodization plan",
      "Priority support",
      "Lifetime updates",
    ],
    cta: "Start Pro",
    highlighted: true,
  },
];
