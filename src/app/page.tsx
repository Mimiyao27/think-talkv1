import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import LandingHero from "@/components/LandingHero";
import LandingFeatures from "@/components/LandingFeatures";
import LandingHowItWorks from "@/components/LandingHowItWorks";
import LandingTopics from "@/components/LandingTopics";
import LandingFooter from "@/components/LandingFooter";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  let isLoggedIn = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = Boolean(data?.user);
  } catch {
    // If Supabase is not reachable or env vars are missing, gracefully treat as guest
    isLoggedIn = false;
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-900 selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <LandingNavbar isLoggedIn={isLoggedIn} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <LandingHero isLoggedIn={isLoggedIn} />
        <LandingFeatures />
        <LandingHowItWorks isLoggedIn={isLoggedIn} />
        <LandingTopics isLoggedIn={isLoggedIn} />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
