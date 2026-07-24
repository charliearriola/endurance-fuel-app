import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { Pricing } from "@/components/sections/pricing";
import { CTA } from "@/components/sections/cta";
import { FAQ } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header isAuthenticated={Boolean(user)} onLogout={logout} />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
