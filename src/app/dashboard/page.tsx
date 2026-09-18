import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signout } from "../login/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all attempts and related evaluations for the logged-in student
  const { data: attempts } = await supabase
    .from('attempts')
    .select(`
      id,
      created_at,
      evaluations (
        score
      )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  // Calculate real stats
  let exercisesCompleted = 0;
  let averageScore = 0;
  let currentStreak = 0;

  if (attempts && attempts.length > 0) {
    exercisesCompleted = attempts.length;

    let totalScore = 0;
    let scoreCount = 0;
    const activeDates = new Set<string>();

    attempts.forEach(attempt => {
      // Calculate score
      if (attempt.evaluations && attempt.evaluations.length > 0) {
        // Supabase returns an array for one-to-many relationships even if it's 1-to-1 conceptually
        const evals = Array.isArray(attempt.evaluations) ? attempt.evaluations : [attempt.evaluations];
        totalScore += evals[0].score;
        scoreCount++;
      }

      // Track unique dates for a simple "streak" or "days active" metric
      const date = new Date(attempt.created_at).toDateString();
      activeDates.add(date);
    });

    if (scoreCount > 0) {
      averageScore = Math.round(totalScore / scoreCount);
    }
    
    // For now, we'll use "Total Active Days" as the streak proxy 
    // since strict consecutive streak logic requires complex date math
    currentStreak = activeDates.size;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">ThinkTalk</h1>
          <form>
            <button formAction={signout} className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">
              Sign Out
            </button>
          </form>
        </header>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome!</h2>
          <p className="text-gray-600 mb-8">Ready for some speaking practice?</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#efebc4] rounded-2xl p-6 border-2 border-black flex flex-col items-center justify-center">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Completed</p>
              <p className="text-4xl font-black text-gray-900">{exercisesCompleted}</p>
            </div>
            <div className="bg-[#e6f4fe] rounded-2xl p-6 border-2 border-black flex flex-col items-center justify-center">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Avg Score</p>
              <p className="text-4xl font-black text-gray-900">{averageScore}</p>
            </div>
            <div className="bg-[#fef0e6] rounded-2xl p-6 border-2 border-black flex flex-col items-center justify-center">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">Active Days</p>
              <p className="text-4xl font-black text-gray-900">{currentStreak}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/practice"
              className="inline-block px-12 py-5 bg-black text-white font-black text-lg rounded-full hover:bg-gray-800 transition-colors uppercase tracking-widest shadow-lg transform hover:scale-105 active:scale-95"
            >
              Start Practice
            </Link>
          </div>
        </div>
        
        {/* Recent Attempts (Optional detail) */}
        {attempts && attempts.length > 0 && (
          <div className="mt-8">
             <h3 className="text-lg font-bold uppercase tracking-wider text-gray-500 mb-4">Recent Practice</h3>
             <div className="flex flex-col gap-3">
               {attempts.slice(0, 3).map((attempt, idx) => (
                 <div key={attempt.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 flex justify-between items-center">
                   <div>
                     <p className="font-bold">Exercise Session #{attempts.length - idx}</p>
                     <p className="text-sm text-gray-500">{new Date(attempt.created_at).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-black text-[#8e24aa] text-lg">
                       {attempt.evaluations && (Array.isArray(attempt.evaluations) ? attempt.evaluations[0]?.score : (attempt.evaluations as any).score) || 0} / 100
                     </p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
