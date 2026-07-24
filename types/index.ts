export type BillingPeriod = "monthly" | "annual";

export type PricingTier = {
  name: string;
  tagline: string;
  priceType: "free" | "one-time" | "subscription";
  oneTimePrice?: number;
  monthlyPrice?: number;
  annualPrice?: number;
  features: string[];
  cta: string;
  ctaVariant?: "default" | "outline";
  note?: string;
  highlighted?: boolean;
};
