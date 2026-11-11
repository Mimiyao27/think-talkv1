import React from "react";
import NewAuthForm from "@/components/NewAuthForm";

const ERROR_MESSAGES: Record<string, { text: string; type: "error" | "warning" }> = {
  incorrect_password: {
    text: "Incorrect email or password. Please try again.",
    type: "error",
  },
  email_exists: {
    text: "That email is already registered. Try logging in instead.",
    type: "warning",
  },
  password_too_short: {
    text: "Password must be at least 6 characters long.",
    type: "error",
  },
  supabase_connection_failed: {
    text: "Could not connect to Supabase database. Please check your environment variables and ensure your Supabase project is active.",
    type: "error",
  },
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; mode?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorCode = params?.error ?? null;
  const modeParam = params?.mode === "register" ? "register" : "login";

  const errorInfo = errorCode
    ? ERROR_MESSAGES[errorCode] ?? { text: decodeURIComponent(errorCode), type: "error" as const }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf6] via-[#fffdfa] to-[#fbf7f4] flex items-center justify-center p-4 sm:p-6">
      <NewAuthForm
        initialMode={modeParam}
        initialError={errorInfo?.text ?? null}
      />
    </div>
  );
}
