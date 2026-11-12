"use client";

import React, { useState } from "react";
import Link from "next/link";
import RegisterModal from "./RegisterModal";
import {
  Sparkles,
  ArrowRight,
  Play,
  GraduationCap,
  Utensils,
  Activity,
  Heart,
  Star,
  Mic,
  CheckCircle2,
  TrendingUp,
  Volume2,
  Flame,
} from "lucide-react";

interface LandingHeroProps {
  isLoggedIn?: boolean;
}

export default function LandingHero({ isLoggedIn = false }: LandingHeroProps) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const categories = [
    {
      icon: GraduationCap,
      title: "School Life",
      subtitle: "Subjects & friends",
      bgColor: "bg-purple-100 text-purple-600 border-purple-200",
    },
    {
      icon: Utensils,
      title: "Favorites",
      subtitle: "Food, drinks & places",
      bgColor: "bg-emerald-100 text-emerald-600 border-emerald-200",
    },
    {
      icon: Activity,
      title: "Daily Routines",
      subtitle: "Hobbies & sports",
      bgColor: "bg-rose-100 text-rose-600 border-rose-200",
    },
    {
      icon: Heart,
      title: "Feelings",
      subtitle: "Share joy & empathy",
      bgColor: "bg-amber-100 text-amber-600 border-amber-200",
    },
    {
      icon: Star,
      title: "Free Speech",
      subtitle: "Open conversations",
      bgColor: "bg-sky-100 text-sky-600 border-sky-200",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-rose-100/40 via-amber-100/30 to-pink-100/40 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-20 right-0 w-96 h-96 bg-rose-50/60 blur-2xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Badge Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/90 text-rose-600 text-xs sm:text-sm font-bold shadow-sm mb-6 hover:bg-rose-100/70 transition-colors">
              <Sparkles className="w-4 h-4 text-rose-500 fill-rose-400" />
              <span>Grade 7 English Speech Companion</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6">
              Speak English with{" "}
              <span className="relative inline-block text-rose-500">
                Confidence
                {/* Playful accent dashes above the word */}
                <svg
                  className="absolute -top-4 -right-5 w-8 h-8 text-rose-400 hidden sm:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="1" y2="10" />
                  <line x1="8" y1="7" x2="6" y2="2" />
                  <line x1="13" y1="5" x2="16" y2="1" />
                </svg>
              </span>{" "}
              on Any Everyday Topic
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
              Turn hesitant answers into fluent speech. Practice speaking prompts with
              <strong className="font-semibold text-slate-800"> real-time streaming speech recognition</strong> and
              <strong className="font-semibold text-slate-800"> instant AI feedback</strong> on grammar, vocabulary,
              and clarity — tailored specifically for Grade 7 learners.
            </p>

            {/* Category / Occasion Icon Row */}
            <div className="w-full mb-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Curriculum Speaking Topics
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center sm:items-start p-2.5 rounded-2xl bg-white/70 border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-100 transition-all text-center sm:text-left group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform ${cat.bgColor}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {cat.title}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:inline">
                        {cat.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <Link
                  href="/practice"
                  className="px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-xl shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
                >
                  <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start Speaking Practice</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-xl shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group cursor-pointer"
                >
                  <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start Practicing Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <a
                href="#how-it-works"
                className="px-6 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-rose-600 ml-0.5" />
                </div>
                <span> How It Works</span>
              </a>
            </div>

            {/* Quick Proof Pills */}
            <div className="mt-8 flex items-center gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Installation Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>AssemblyAI Streaming</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Gemini 3.8 Feedback</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Glassmorphic Cards Layered 3D Composition */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">

            {/* Radiant Ambient Glowing Background Backlights */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-6 right-2 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 left-2 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Container for the 3D Layered Cards */}
            <div className="relative w-full max-w-[420px]">

              {/* Floating Card 1: Top-Right AI Score Evaluation Badge */}
              <div className="absolute -top-10 -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-emerald-100 shadow-2xl shadow-emerald-900/10 rotate-[3deg] hover:rotate-0 transition-transform duration-300 max-w-[210px] sm:max-w-[230px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini AI Score</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    Grade A+
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">96</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>

                {/* Mini Rubric Progress Bars */}
                <div className="space-y-1.5 text-[10px] font-semibold text-slate-600">
                  <div>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span>Grammar</span>
                      <span className="text-emerald-600 font-bold">95%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[95%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span>Fluency</span>
                      <span className="text-teal-600 font-bold">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[98%]" />
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-slate-500 italic bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-100/60 leading-tight">
                  ✨ &quot;Vivid vocabulary &amp; natural flow!&quot;
                </p>
              </div>

              {/* Floating Card 2: Top-Left Student Active Speaker Pill */}
              <div className="absolute -top-7 -left-2 sm:-left-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-slate-200/80 shadow-lg shadow-slate-900/5 rotate-[-4deg] hover:rotate-0 transition-transform duration-300 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  A
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">Alex (Grade 7)</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Speaking Now</span>
                  </div>
                </div>
              </div>

              {/* Main Anchor Card: Active Speaking Session (Glassmorphism Widget) */}
              <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-7 border-2 border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                
                {/* Widget Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">ThinkTalk Live</span>
                      <p className="text-[10px] text-slate-400 font-medium">Grade 7 Practice Room</p>
                    </div>
                  </div>

                  {/* Live Recording Badge */}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>REC 00:28</span>
                  </div>
                </div>

                {/* Question Prompt Section */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      🍕 Food &amp; Favorites
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Prompt #001</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 mb-1.5">
                    What is your favorite food and why?
                  </p>
                  <div className="bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/70 text-slate-700 text-xs font-mono leading-relaxed">
                    &quot;My favorite food is _____ because I enjoy it when _____.&quot;
                  </div>
                </div>

                {/* AssemblyAI Real-Time Streaming Audio Visualizer */}
                <div className="bg-gradient-to-r from-rose-50/80 via-pink-50/80 to-amber-50/80 rounded-2xl p-4 border border-rose-200/80 mb-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-rose-500" />
                      <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                        AssemblyAI Streaming
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200">
                      ● Transcribing Live
                    </span>
                  </div>

                  {/* Oscillating Audio Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-7 mb-3 bg-white/70 rounded-xl px-4 py-1">
                    <span className="w-1 bg-rose-400 rounded-full h-2 animate-pulse" />
                    <span className="w-1 bg-rose-500 rounded-full h-5 animate-pulse delay-75" />
                    <span className="w-1 bg-pink-500 rounded-full h-3 animate-pulse delay-100" />
                    <span className="w-1 bg-rose-600 rounded-full h-6 animate-pulse delay-150" />
                    <span className="w-1 bg-amber-500 rounded-full h-4 animate-pulse delay-200" />
                    <span className="w-1 bg-rose-500 rounded-full h-7 animate-pulse delay-75" />
                    <span className="w-1 bg-pink-600 rounded-full h-4 animate-pulse delay-300" />
                    <span className="w-1 bg-rose-400 rounded-full h-2 animate-pulse delay-150" />
                    <span className="w-1 bg-amber-400 rounded-full h-5 animate-pulse delay-100" />
                    <span className="w-1 bg-rose-500 rounded-full h-3 animate-pulse" />
                  </div>

                  {/* Live Spoken Transcript Text */}
                  <div className="bg-white/95 rounded-xl p-3 border border-rose-100 shadow-xs">
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">
                      &quot;My favorite food is{" "}
                      <span className="font-bold text-rose-600 bg-rose-100/70 px-1 py-0.5 rounded-md">
                        homemade pasta
                      </span>{" "}
                      because it makes me happy when my grandma cooks it for Sunday dinner.&quot;
                    </p>
                  </div>
                </div>

                {/* Widget Footer Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Microphone active (16 kHz PCM)</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25 animate-pulse">
                    <Mic className="w-4 h-4" />
                  </div>
                </div>

              </div>

              {/* Floating Card 3: Bottom-Left Streak & Confidence Badge */}
              <div className="absolute -bottom-7 -left-2 sm:-left-6 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-amber-200/80 shadow-xl shadow-amber-900/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <Flame className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900">5-Day Speaking Streak!</span>
                    <span className="text-amber-500 text-xs">🔥</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">
                    Confidence: <strong className="text-rose-600">Advanced Speaker</strong>
                  </p>
                </div>
              </div>

              {/* Floating Card 4: Bottom-Right Instant Feedback Tag */}
              <div className="absolute -bottom-6 -right-2 sm:-right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-emerald-200/80 shadow-lg shadow-emerald-900/5 rotate-[3deg] hover:rotate-0 transition-transform duration-300 flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800">Grammar: 95% Verified</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Registration Modal Popup */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialMode="register"
      />
    </section>
  );
}

