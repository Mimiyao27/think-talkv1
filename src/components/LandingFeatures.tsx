"use client";

import React from "react";
import { Mic, Cpu, Award, Zap, BookCheck, ShieldCheck } from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Streaming Transcription",
      description:
        "Powered by AssemblyAI Streaming v3 over WebSockets. Your speech turns into text with near-instant responsiveness as you speak.",
      color: "from-amber-500 to-orange-500",
      badge: "AssemblyAI v3",
    },
    {
      icon: Cpu,
      title: "Intelligent Gemini AI Evaluation",
      description:
        "State-of-the-art Google Gemini models evaluate your spoken answers against Grade 7 rubrics for grammar, vocabulary, and topic relevance.",
      color: "from-rose-500 to-pink-500",
      badge: "Multi-Model AI",
    },
    {
      icon: BookCheck,
      title: "Grade 7 Curriculum Aligned",
      description:
        "Structured prompts with guided fill-in-the-blank scaffolds help learners construct full sentences before transitioning to spontaneous answers.",
      color: "from-purple-500 to-indigo-500",
      badge: "Pedagogy First",
    },
    {
      icon: Award,
      title: "Score & Streak Gamification",
      description:
        "Students earn scores out of 100, receive supportive tips, and maintain active daily speaking streaks to build lasting confidence.",
      color: "from-emerald-500 to-teal-500",
      badge: "Confidence Building",
    },
    {
      icon: Mic,
      title: "Stress-Free Private Practice",
      description:
        "Practice at your own pace without peer pressure. Unlimited retries allow students to rephrase and improve until they feel confident.",
      color: "from-sky-500 to-blue-500",
      badge: "Safe Environment",
    },
    {
      icon: ShieldCheck,
      title: "Preserved Transcripts",
      description:
        "If a network glitch ever occurs, your spoken answer is preserved on screen so you never lose your practice attempt.",
      color: "from-fuchsia-500 to-rose-500",
      badge: "Reliable & Resilient",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/70 border-y border-rose-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100/60 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
            Built for Young Learners
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Everything Students Need to Speak with Fluency
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            ThinkTalk combines cutting-edge speech recognition with classroom-friendly AI coaching to help every 7th grader find their voice.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-rose-200 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-rose-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

