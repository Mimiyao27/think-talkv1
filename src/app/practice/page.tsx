import React from "react";
import SpeechPractice from "@/components/SpeechPractice";
import { Exercise } from "@/types/exercise";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Guided fill-in-the-blank exercises with an open question prompt
  const exercises: Exercise[] = [
    {
      id: "001",
      question: "What is your favorite food?\n\nMy favorite food is __________ because I enjoy it when __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Food",
      type: "fill-in-the-blank"
    },
    {
      id: "002",
      question: "What is your favorite drink?\n\nMy favorite drink is __________ because __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Food",
      type: "fill-in-the-blank"
    },
    {
      id: "003",
      question: "What do you enjoy doing after school?\n\nAfter school, I usually __________ because it helps me __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Daily Activities",
      type: "fill-in-the-blank"
    },
    {
      id: "004",
      question: "What makes you happy?\n\nI feel happy when __________ because __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Feelings",
      type: "fill-in-the-blank"
    },
    {
      id: "005",
      question: "What is your favorite subject?\n\nMy favorite subject is __________ because I want to learn more about __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "School",
      type: "fill-in-the-blank"
    },
    {
      id: "006",
      question: "What is something you would like to improve?\n\nI would like to improve my __________ because __________. I can practice by __________.",
      difficulty: "intermediate",
      gradeLevel: 7,
      category: "Goals",
      type: "fill-in-the-blank"
    },
    {
      id: "007",
      question: "Who is your favorite person to talk to?\n\nMy favorite person to talk to is __________ because __________.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Relationships",
      type: "fill-in-the-blank"
    },
    {
      id: "008",
      question: "What is something you would like to learn?\n\nI would like to learn how to __________ because __________.",
      difficulty: "intermediate",
      gradeLevel: 7,
      category: "Goals",
      type: "fill-in-the-blank"
    },
  ];

  // Pick a random exercise
  const sampleExercise = exercises[Math.floor(Math.random() * exercises.length)];


  return (
    <main className="min-h-screen bg-white flex flex-col pt-12 pb-24">
      {/* Header with back button */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mb-8 flex justify-between items-center">
        <Link href="/dashboard" className="text-gray-500 hover:text-black font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="w-full text-center mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">ThinkTalk</h1>
        <p className="text-gray-600 mt-2 text-lg">Turning Thoughts into Talk</p>
      </div>

      <SpeechPractice exercise={sampleExercise} />
      
    </main>
  );
}
