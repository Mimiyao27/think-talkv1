"use client";

import React from "react";
import Link from "next/link";
import { Mic, CheckCircle2, Sparkles, ArrowRight, BookOpen, BarChart3 } from "lucide-react";

interface LandingHowItWorksProps {
  isLoggedIn?: boolean;
}

export default function LandingHowItWorks({ isLoggedIn = false }: LandingHowItWorksProps) {
  const steps = [
    {
      step: "01",
      icon: BookOpen,
      title: "Choose a Guided Prompt",
      desc: "Pick from everyday relatable topics like Favorite Foods, Hobbies, School Life, and Feelings. Each prompt provides a helpful sentence starter.",
      color: "bg-purple-100 text-purple-600 border-purple-200",
      accent: "text-purple-600",
    },
    {
      step: "02",
      icon: Mic,
      title: "Tap Mic & Speak Out Loud",
      desc: "Press the microphone button and talk naturally. AssemblyAI converts your voice into text in real-time right before your eyes with no lag.",
      color: "bg-rose-100 text-rose-600 border-rose-200",
      accent: "text-rose-600",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Receive Instant AI Feedback",
      desc: "Google Gemini assesses your sentence structure, grammar correctness, and clarity, providing an encouraging score and personalized tips.",
      color: "bg-amber-100 text-amber-600 border-amber-200",
      accent: "text-amber-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            Simple 3-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            How ThinkTalk Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Designed to make daily English speaking practice effortless, supportive, and engaging for students.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-rose-200 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 group-hover:text-rose-300 transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color} shadow-xs group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Takes less than 2 minutes</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bottom Banner */}
        <div id="curriculum" className="mt-16 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white inline-block mb-3">
              Grade 7 Speaking Benchmark
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Ready to Practice Your First Question Prompt?
            </h3>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              No pressure, no judgment. Practice as many times as you like, improve your pronunciation and sentence formation, and watch your confidence grow every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href={isLoggedIn ? "/practice" : "/login"}
              className="w-full sm:w-auto px-8 py-4 bg-white text-rose-600 font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>{isLoggedIn ? "Go to Practice Room" : "Start Practicing Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

