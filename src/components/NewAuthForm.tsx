"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface NewAuthFormProps {
  initialMode?: "login" | "register";
  initialError?: string | null;
}

export default function NewAuthForm({
  initialMode = "login",
  initialError = null,
}: NewAuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === "register") {
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters long.");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match. Please verify both password fields.");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            },
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes("fetch failed")) {
            setErrorMsg("Could not connect to database. Please check your Supabase connection.");
          } else if (
            error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("user already registered")
          ) {
            setErrorMsg("That email is already registered. Try logging in instead.");
          } else {
            setErrorMsg(error.message);
          }
          setIsLoading(false);
          return;
        }

        if (data?.session) {
          setSuccessMsg("Account registered successfully! Redirecting to dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 600);
        } else {
          setSuccessMsg("Registration successful! Check your email to confirm, or log in.");
          setTimeout(() => {
            setMode("login");
            setIsLoading(false);
          }, 1500);
        }
      } else {
        // Log in flow
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (
            error.message.toLowerCase().includes("invalid login credentials") ||
            error.message.toLowerCase().includes("invalid credentials")
          ) {
            setErrorMsg("Incorrect email or password. Please try again.");
          } else if (error.message.toLowerCase().includes("fetch failed")) {
            setErrorMsg("Could not connect to database. Please try again.");
          } else {
            setErrorMsg(error.message);
          }
          setIsLoading(false);
          return;
        }

        setSuccessMsg("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Could not start Google sign in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[370px]">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
            ThinkTalk
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">Grade 7 English Speaking Companion</p>
      </div>

      {/* Wireframe Phone Card matching design reference */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "44px",
          border: "3px solid #000000",
          padding: "32px 24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          boxSizing: "border-box",
        }}
      >
        {/* Tab Toggle Switcher */}
        <div className="flex items-center justify-center bg-slate-100 p-1 rounded-full mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 900,
            textAlign: "center",
            color: "#000000",
            marginBottom: "20px",
            letterSpacing: "-0.025em",
          }}
        >
          {mode === "register" ? "Register Account" : "Log In"}
        </h1>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-semibold rounded-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-2xl flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          {mode === "register" ? (
            <>
              {/* Firstname */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Firstname
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>

              {/* Lastname */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Lastname
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>
            </>
          ) : (
            <>
              {/* Login Email */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>

              {/* Login Password */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", color: "#000000", marginBottom: "4px", marginLeft: "4px" }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#cbd5e1",
                    color: "#0f172a",
                    fontWeight: 500,
                    padding: "10px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                  placeholder=""
                />
              </div>
            </>
          )}

          {/* Primary Action Button (Matches Wireframe pill) */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: "#cbd5e1",
              color: "#0f172a",
              fontWeight: 900,
              padding: "12px",
              borderRadius: "9999px",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxSizing: "border-box",
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-800" />
            ) : mode === "register" ? (
              "REGISTER"
            ) : (
              "LOG IN"
            )}
          </button>

          {/* OR Divider */}
          <div
            style={{
              textAlign: "center",
              fontWeight: 900,
              fontSize: "12px",
              color: "#0f172a",
              margin: "12px 0",
              textTransform: "uppercase",
            }}
          >
            OR
          </div>

          {/* Continue with Google (Matches Wireframe pill) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: "#cbd5e1",
              color: "#0f172a",
              fontWeight: 700,
              padding: "10px",
              borderRadius: "9999px",
              fontSize: "14px",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxSizing: "border-box",
            }}
          >
            <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: "#475569" }}>
          {mode === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                }}
                style={{
                  fontWeight: "bold",
                  color: "#000000",
                  textDecoration: "underline",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg(null);
                }}
                style={{
                  fontWeight: "bold",
                  color: "#000000",
                  textDecoration: "underline",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
              >
                Register Account
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

