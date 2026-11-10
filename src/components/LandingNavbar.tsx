"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mic, Menu, X, ArrowRight, Sparkles, UserCheck } from "lucide-react";

interface LandingNavbarProps {
  isLoggedIn?: boolean;
}

export default function LandingNavbar({ isLoggedIn = false }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                ThinkTalk
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 -mt-1">
                Grade 7 English
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a
              href="#features"
              className="hover:text-rose-600 transition-colors py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-rose-600 transition-colors py-1"
            >
              How It Works
            </a>
            <a
              href="#topics"
              className="hover:text-rose-600 transition-colors py-1"
            >
              Topics
            </a>
            <a
              href="#curriculum"
              className="hover:text-rose-600 transition-colors py-1"
            >
              Grade 7 Focus
            </a>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Dashboard
                </Link>
                <Link
                  href="/practice"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-full shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Practicing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-rose-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-full transition-all"
                >
                  Sign Up Free
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Free Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-100 bg-white/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 pt-2 text-base font-semibold text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#topics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              Topics
            </a>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              Grade 7 Focus
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-full"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/practice"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-md"
                >
                  Start Practicing →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-md"
                >
                  Start Practicing Free →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

