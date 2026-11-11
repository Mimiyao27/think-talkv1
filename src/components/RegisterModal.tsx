"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "register" | "login";
}

export default function RegisterModal({
  isOpen,
  onClose,
  initialMode = "register",
}: RegisterModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      if (mode === "register") {
        // Validation
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
            setErrorMsg("Could not connect to database. Please verify your connection.");
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

        // Check if email confirmation is required or auto-confirmed
        if (data?.session) {
          setSuccessMsg("Account registered successfully! Redirecting...");
          setTimeout(() => {
            onClose();
            router.push("/dashboard");
            router.refresh();
          }, 800);
        } else {
          setSuccessMsg("Registration successful! Check your email to confirm your account, or log in.");
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
          onClose();
          router.push("/dashboard");
          router.refresh();
        }, 600);
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
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-[2.8rem] border-[3px] border-black p-6 sm:p-8 shadow-2xl flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-6 text-slate-400 hover:text-black p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-black text-center text-black mb-6 tracking-tight">
          {mode === "register" ? "Register Account" : "Welcome Back"}
        </h2>

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
        <form onSubmit={handleSubmit} className="flex flex-col">
          {mode === "register" ? (
            <>
              {/* Firstname */}
              <div className="mb-3">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Firstname
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>

              {/* Lastname */}
              <div className="mb-3">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Lastname
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>

              {/* Email Address */}
              <div className="mb-3">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>
            </>
          ) : (
            <>
              {/* Login Email */}
              <div className="mb-3">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>

              {/* Login Password */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-black mb-1 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#c8d1d9] text-slate-900 font-medium px-4 py-2.5 rounded-full border-none outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
                  placeholder=""
                />
              </div>
            </>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c8d1d9] hover:bg-[#b5c0ca] active:scale-[0.98] text-slate-900 font-black py-3 rounded-full text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
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
          <div className="text-center font-black text-xs text-slate-900 my-2.5 uppercase tracking-wide">
            OR
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-[#c8d1d9] hover:bg-[#b5c0ca] active:scale-[0.98] text-slate-900 font-bold py-2.5 rounded-full text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            {/* Google G Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        <div className="mt-4 text-center text-xs text-slate-600">
          {mode === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-black underline hover:text-slate-700 cursor-pointer"
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
                  setSuccessMsg(null);
                }}
                className="font-bold text-black underline hover:text-slate-700 cursor-pointer"
              >
                Register Account
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

