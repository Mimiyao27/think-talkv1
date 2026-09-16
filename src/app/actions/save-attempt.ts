"use server";

import { createClient } from "@supabase/supabase-js";
import { EvaluationResult } from "@/types/evaluation";
import { Exercise } from "@/types/exercise";

export async function saveAttemptToDatabase(exercise: Exercise, transcript: string, evaluation: EvaluationResult) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not set. Skipping database save in Stage 5.");
    return { success: false, message: "Credentials missing" };
  }

  // Use service role key to bypass RLS before we have real auth in Stage 6
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. We assume the exercise might not exist in the DB yet for local testing.
    // In a real app, the exercise is already in the DB. We'll upsert it just in case.
    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercises')
      .upsert({
        id: "00000000-0000-0000-0000-000000000001", // Dummy UUID for this sample
        question: exercise.question,
        difficulty: exercise.difficulty,
        grade_level: exercise.gradeLevel,
        category: exercise.category
      })
      .select()
      .single();

    if (exerciseError) throw exerciseError;

    // We still use the service key to bypass RLS for inserts if RLS is strict,
    // or we can use the regular authenticated client. But to know who called this:
    const { createClient: createServerClient } = await import("@/utils/supabase/server");
    const userClient = await createServerClient();
    const { data: { user }, error: userError } = await userClient.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // 2. Save the attempt (Using real student ID)
    const { data: attemptData, error: attemptError } = await supabase
      .from('attempts')
      .insert({
        student_id: user.id,
        exercise_id: exerciseData.id,
        transcript: transcript
      })
      .select()
      .single();

    if (attemptError) throw attemptError;

    // 3. Save the evaluation
    const { error: evalError } = await supabase
      .from('evaluations')
      .insert({
        attempt_id: attemptData.id,
        grammar_status: evaluation.grammar.status,
        grammar_feedback: evaluation.grammar.feedback,
        meaning_status: evaluation.meaning.status,
        meaning_feedback: evaluation.meaning.feedback,
        completeness_status: evaluation.completeness.status,
        completeness_feedback: evaluation.completeness.feedback,
        relevance_status: evaluation.relevance.status,
        relevance_feedback: evaluation.relevance.feedback,
        score: evaluation.score,
        overall_feedback: evaluation.feedback
      });

    if (evalError) throw evalError;

    return { success: true };
  } catch (error) {
    console.error("Failed to save attempt to Supabase:", error);
    return { success: false, error: "Failed to save to database" };
  }
}
