import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import crypto from "crypto";

// Map Lemon Squeezy variant IDs → plan_type in our DB
// Fill these in once you have the variant IDs from LS dashboard
const VARIANT_PLAN_MAP: Record<string, string> = {
  "1955545": "starter", // Starter Monthly
  "1955546": "starter", // Starter Annual (update with real ID)
  "1955579": "pro",     // Pro Monthly
  "1955580": "pro",     // Pro Annual (update with real ID)
};

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = headers().get("x-signature") ?? "";

  if (!verifySignature(rawBody, sig)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name ?? "";
  const data = payload.data;

  // Handle order_created (Race Day Kit one-time purchase)
  if (eventName === "order_created") {
    const status = data?.attributes?.status;
    if (status !== "paid") {
      return new Response("OK", { status: 200 });
    }
    const email: string = data?.attributes?.user_email ?? "";
    const variantId = String(
      data?.attributes?.first_order_item?.variant_id ?? ""
    );

    if (email && variantId) {
      await updatePlan(email, variantId);
    }
  }

  // Handle subscription_created and subscription_updated
  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated"
  ) {
    const status = data?.attributes?.status;
    // Only activate on active/trialing, deactivate on cancelled/expired
    const email: string = data?.attributes?.user_email ?? "";
    const variantId = String(data?.attributes?.variant_id ?? "");

    if (!email) return new Response("OK", { status: 200 });

    if (status === "active" || status === "trialing") {
      await updatePlan(email, variantId);
    } else if (status === "cancelled" || status === "expired") {
      await downgradePlan(email);
    }
  }

  return new Response("OK", { status: 200 });
}

async function updatePlan(email: string, variantId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const planType = VARIANT_PLAN_MAP[variantId] ?? null;
  if (!planType) return;

  // Find the user by email in auth.users, then update their profile
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users?.find((u) => u.email === email);
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ plan_type: planType })
    .eq("id", user.id);
}

async function downgradePlan(email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users?.find((u) => u.email === email);
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ plan_type: "free" })
    .eq("id", user.id);
}
