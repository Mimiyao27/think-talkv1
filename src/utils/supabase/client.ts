import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  )?.trim().replace(/^["']|["']$/g, "").replace(/\/$/, "");

  let supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY
  )?.trim().replace(/^["']|["']$/g, "");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in Vercel Environment Variables."
    );
  }

  if (supabaseUrl.includes("your-project.supabase.co") || supabaseUrl.includes("example.com")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is set to a placeholder. Please set your real Supabase Project URL in Vercel."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
