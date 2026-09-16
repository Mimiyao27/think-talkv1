import { createClient } from "@supabase/supabase-js";

// This file is strictly for client-side usage if needed.
// For server actions, we will use the Service Role Key to bypass RLS until Stage 6 (Auth) is implemented.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// A basic client for public data
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
