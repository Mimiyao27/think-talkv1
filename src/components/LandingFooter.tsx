"use client";

import React from "react";
import Link from "next/link";
import { Mic, Heart } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight">ThinkTalk</span>
              <p className="text-xs text-slate-500 font-medium">Turning thoughts into confident English talk.</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a>
            <a href="#topics" className="hover:text-rose-600 transition-colors">Topics</a>
            <Link href="/login" className="hover:text-rose-600 transition-colors">Student Login</Link>
            <Link href="/practice" className="hover:text-rose-600 transition-colors">Practice Room</Link>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ThinkTalk. Empowering Grade 7 English learners worldwide.</p>
          <p className="flex items-center gap-1.5">
            Powered by AssemblyAI Streaming v3 &amp; Google Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}

