import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/assemblyai-token
 * Returns a short-lived AssemblyAI real-time token.
 * Only authenticated users can get one (guarded by Supabase session check).
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Supabase environment variables not configured in this deployment" },
      { status: 500 }
    );
  }

  // Ensure the user is logged in before minting a token
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch (err: any) {
    console.error("Supabase user auth check error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to authenticate session with database" },
      { status: 401 }
    );
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AssemblyAI API key not configured in environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://streaming.assemblyai.com/v3/token?expires_in_seconds=480",
      {
        method: "GET",
        headers: {
          authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("AssemblyAI token error:", err);
      return NextResponse.json(
        { error: "Failed to create token" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch (error) {
    console.error("AssemblyAI token fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

