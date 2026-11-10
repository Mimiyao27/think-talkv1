"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mic, ArrowRight, Sparkles, BookOpen } from "lucide-react";

interface LandingTopicsProps {
  isLoggedIn?: boolean;
}

export default function LandingTopics({ isLoggedIn = false }: LandingTopicsProps) {
  const [selectedTopic, setSelectedTopic] = useState(0);

  const samplePrompts = [
    {
      category: "Food",
      title: "Favorite Food",
      question: "What is your favorite food and why?",
      scaffold: "My favorite food is __________ because I enjoy it when __________.",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      sampleAnswer: "My favorite food is homemade pasta because I enjoy it when my family cooks together on weekends.",
      grade: "96 / 100",
    },
    {
      category: "Daily Activities",
      title: "After School Hobbies",
      question: "What do you enjoy doing after school?",
      scaffold: "After school, I usually __________ because it helps me __________.",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      sampleAnswer: "After school, I usually play badminton with my friends because it helps me relax and stay active.",
      grade: "98 / 100",
    },
    {
      category: "Feelings",
      title: "What Makes You Happy",
      question: "What brings you true happiness?",
      scaffold: "I feel happy when __________ because __________.",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      sampleAnswer: "I feel happy when I finish a good book because the stories inspire my imagination.",
      grade: "94 / 100",
    },
    {
      category: "School Life",
      title: "Favorite Subject",
      question: "What is your favorite school subject?",
      scaffold: "My favorite subject is __________ because I want to learn more about __________.",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      sampleAnswer: "My favorite subject is Science because I want to learn more about how our solar system works.",
      grade: "97 / 100",
    },
  ];

  return (
    <section id="topics" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            Practice Previews
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Explore Grade 7 Speaking Prompts
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Each exercise provides scaffolded sentence starters to help students answer clearly and fluently.
          </p>
        </div>

        {/* Interactive Prompt Tabs & Card */}
        <div className="max-w-4xl mx-auto">
          {/* Topic Pills Tab Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTopic(idx)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedTopic === idx
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {prompt.category}: {prompt.title}
              </button>
            ))}
          </div>

          {/* Active Prompt Interactive Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${samplePrompts[selectedTopic].badgeColor}`}>
                {samplePrompts[selectedTopic].category} • Grade 7
              </span>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Example AI Score: {samplePrompts[selectedTopic].grade}</span>
              </div>
            </div>

            {/* Prompt Text */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {samplePrompts[selectedTopic].question}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Guided Scaffold:
              </p>
              <div className="mt-1.5 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-slate-800 text-sm font-mono">
                {samplePrompts[selectedTopic].scaffold}
              </div>
            </div>

            {/* Simulated Spoken Transcript & Evaluation */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>Student Speech Transcript (AssemblyAI):</span>
                  <span className="text-emerald-600">● 100% Recognized</span>
                </div>
                <p className="text-sm font-medium text-slate-800 italic">
                  &quot;{samplePrompts[selectedTopic].sampleAnswer}&quot;
                </p>
              </div>
            </div>

            {/* Call to Practice This Specific Topic */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-rose-500" />
                10+ curated prompts available now
              </span>
              <Link
                href={isLoggedIn ? "/practice" : "/login"}
                className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Try This Speaking Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

