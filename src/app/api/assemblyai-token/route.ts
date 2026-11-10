import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/assemblyai-token
 * Returns a short-lived AssemblyAI real-time token.
 * Only authenticated users can get one (guarded by Supabase session check).
 */
export async function GET() {
  // Ensure the user is logged in before minting a token
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AssemblyAI API key not configured" },
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

