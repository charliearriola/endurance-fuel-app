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
    checkoutOneTime:
      "https://gas2u.lemonsqueezy.com/checkout/buy/e7fe0bc2-62e4-40db-b844-ddab78461960",
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
    checkoutMonthly:
      "https://gas2u.lemonsqueezy.com/checkout/buy/bf17dd29-6fd7-4aa4-8f91-eaf6c1e896b3?enabled=1955545",
    checkoutAnnual:
      "https://gas2u.lemonsqueezy.com/checkout/buy/f8fbea0c-2cd6-4b88-9ad4-80e4a1b5d509",
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
    checkoutMonthly:
      "https://gas2u.lemonsqueezy.com/checkout/buy/f7dd34e4-3cea-4a23-9ed7-c0a5203be6f8?enabled=1955579",
    checkoutAnnual:
      "https://gas2u.lemonsqueezy.com/checkout/buy/41d83444-24fc-4fd8-a580-53b52690cb85",
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
