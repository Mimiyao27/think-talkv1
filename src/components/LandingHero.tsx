"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";

interface LandingHeroProps {
  isLoggedIn?: boolean;
}

export default function LandingHero({ isLoggedIn = false }: LandingHeroProps) {
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
              <Link
                href={isLoggedIn ? "/practice" : "/login"}
                className="px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-500 via-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-xl shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
              >
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{isLoggedIn ? "Start Speaking Practice" : "Start Practicing Free"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className="px-6 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-rose-600 ml-0.5" />
                </div>
                <span>Watch How It Works</span>
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

          {/* Right Column: Mobile Phone Mockup with Playful Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/50 via-amber-200/40 to-pink-200/50 rounded-full blur-3xl scale-95 pointer-events-none" />

            {/* Floating Element 1: Cute Mail Envelope Badge (Top Left) */}
            <div className="absolute -top-4 -left-6 sm:-left-8 z-20 bg-amber-300 text-slate-900 px-3.5 py-2.5 rounded-2xl shadow-lg border-2 border-white rotate-[-8deg] flex items-center gap-2 text-xs font-black animate-bounce duration-1000">
              <span className="text-base">💌</span>
              <div>
                <p className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">New Prompt</p>
                <p className="font-extrabold text-xs">Favorite Food!</p>
              </div>
            </div>

            {/* Floating Element 2: Polaroid Photo Badge (Top Right) */}
            <div className="absolute -top-6 -right-2 sm:-right-6 z-20 bg-white p-2.5 pb-3 rounded-2xl shadow-xl border-2 border-slate-100 rotate-[10deg] max-w-[125px]">
              <div className="w-full h-16 bg-gradient-to-br from-rose-400 to-amber-300 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-inner">
                <div className="text-center">
                  <div className="text-xl">🌟</div>
                  <span className="text-[10px]">Top Speaker</span>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-700 text-center mt-1.5">
                Alex (Grade 7)
              </p>
            </div>

            {/* Floating Element 3: 3D Gift / Streak Card (Bottom Right) */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 z-20 bg-white p-3 rounded-2xl shadow-xl border border-rose-100 rotate-[-4deg] flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-md shadow-rose-500/20">
                🎁
              </div>
              <div>
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Achievement</p>
                <p className="text-xs font-black text-slate-800">5-Day Speaking Streak!</p>
              </div>
            </div>

            {/* Floating Element 4: Score Tag (Bottom Left) */}
            <div className="absolute bottom-12 -left-4 sm:-left-8 z-20 bg-emerald-500 text-white px-3 py-2 rounded-2xl shadow-lg border-2 border-white rotate-[6deg] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-100" />
              <span className="text-xs font-black">Score: 96 / 100</span>
            </div>

            {/* Phone Mockup Frame */}
            <div className="relative w-[310px] sm:w-[340px] bg-slate-900 p-3 rounded-[3rem] shadow-2xl border-4 border-slate-800">
              
              {/* Screen Shell */}
              <div className="relative bg-white rounded-[2.4rem] overflow-hidden flex flex-col border border-slate-200">
                
                {/* Dynamic Island / Speaker Header */}
                <div className="w-full bg-slate-100 pt-3 pb-2 px-6 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-800">9:41</span>
                  {/* Notch Pill */}
                  <div className="w-20 h-4 bg-slate-900 rounded-full" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                    <div className="w-3.5 h-2 border border-slate-800 rounded-xs" />
                  </div>
                </div>

                {/* In-App Header */}
                <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span className="font-black text-sm text-slate-900">ThinkTalk</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-[10px] font-bold text-rose-600 border border-rose-200">
                    <span>Grade 7</span>
                  </div>
                </div>

                {/* Mockup Body Content */}
                <div className="p-4 space-y-3.5 bg-slate-50/60">
                  
                  {/* Greeting Banner */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Hello, Alex! 👋</p>
                      <p className="text-[10px] text-slate-500">Ready for today&apos;s prompt?</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      A
                    </div>
                  </div>

                  {/* Active Question Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                        Prompt #001 • Food
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Difficulty: Beginner</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      What is your favorite food?
                    </p>
                    <p className="text-[11px] text-slate-500 italic mt-1 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      &quot;My favorite food is _____ because I enjoy it when _____.&quot;
                    </p>
                  </div>

                  {/* Real-time Streaming STT Simulation */}
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 p-3 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                          AssemblyAI Streaming
                        </span>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                    </div>

                    {/* Animated Audio Waveform */}
                    <div className="flex items-center justify-center gap-1 h-5 mb-2">
                      <span className="w-1 bg-rose-400 rounded-full h-2 animate-pulse" />
                      <span className="w-1 bg-rose-500 rounded-full h-4 animate-pulse delay-75" />
                      <span className="w-1 bg-rose-600 rounded-full h-5 animate-pulse delay-150" />
                      <span className="w-1 bg-rose-500 rounded-full h-3 animate-pulse delay-100" />
                      <span className="w-1 bg-rose-400 rounded-full h-4 animate-pulse delay-200" />
                      <span className="w-1 bg-rose-300 rounded-full h-2 animate-pulse" />
                    </div>

                    <p className="text-xs font-medium text-slate-800 leading-relaxed bg-white/80 p-2 rounded-xl border border-rose-100">
                      &quot;My favorite food is <span className="font-bold text-rose-600">homemade pasta</span> because it makes me happy when my grandma cooks it.&quot;
                    </p>
                  </div>

                  {/* AI Evaluation Snapshot */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-800">
                          Gemini 3.8 Evaluation
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        96 / 100
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-snug">
                      ✨ Great structure! You gave both your favorite food and a touching personal reason.
                    </p>
                  </div>

                </div>

                {/* Bottom App Navigation Mockup */}
                <div className="bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-around text-slate-400 text-[10px] font-bold">
                  <div className="flex flex-col items-center text-rose-500">
                    <Mic className="w-4 h-4" />
                    <span>Practice</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingUp className="w-4 h-4" />
                    <span>Stats</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Star className="w-4 h-4" />
                    <span>Badges</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

