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

  // A mix of fill-in-the-blank and open-ended exercises
  const exercises: Exercise[] = [
    {
      id: "001",
      question: "Hi, everyone! I'm _______, but you can call me _______. I'm ___ years old and I'm from _______. My hobbies are _______, _______, and _______. My favorite subject is _______ because _______. Nice to meet you all!",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Introductions",
      type: "fill-in-the-blank"
    },
    {
      id: "002",
      question: "Yesterday, I went to the ______ with my friends.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Daily Activities",
      type: "fill-in-the-blank"
    },
    {
      id: "003",
      question: "What did you do last weekend?",
      difficulty: "intermediate",
      gradeLevel: 7,
      category: "Free Time",
      type: "open-ended"
    },
    {
      id: "004",
      question: "What is your favorite subject in school and why?",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "School",
      type: "open-ended"
    },
    {
      id: "005",
      question: "If you had a free day, what would you do?",
      difficulty: "advanced",
      gradeLevel: 7,
      category: "Imagination",
      type: "open-ended"
    },
    {
      id: "006",
      question: "Describe your best friend.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Friends",
      type: "open-ended"
    },
    {
      id: "007",
      question: "What do you usually do after school?",
      difficulty: "intermediate",
      gradeLevel: 7,
      category: "Daily Activities",
      type: "open-ended"
    },
    {
      id: "008",
      question: "What place would you like to visit and why?",
      difficulty: "intermediate",
      gradeLevel: 7,
      category: "Travel",
      type: "open-ended"
    },
    {
      id: "009",
      question: "What is your favorite food?",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "Food",
      type: "open-ended"
    },
    {
      id: "010",
      question: "Describe your classroom.",
      difficulty: "beginner",
      gradeLevel: 7,
      category: "School",
      type: "open-ended"
    }
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
