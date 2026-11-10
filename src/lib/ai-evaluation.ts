import { Exercise } from "@/types/exercise";
import { EvaluationResult } from "@/types/evaluation";

/**
 * Sends the student's transcript to our server-side Gemini evaluation API.
 * The Gemini API key stays secret on the server — no client-side AI SDK needed.
 */
export async function evaluateResponse(
  exercise: Exercise,
  transcript: string
): Promise<EvaluationResult> {
  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        exerciseQuestion: exercise.question,
        exerciseType: exercise.type ?? "fill-in-the-blank",
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.error || `Evaluation request failed (${response.status})`
      );
    }

    const evaluation = (await response.json()) as EvaluationResult;
    return evaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error(
      "We couldn't evaluate your answer right now. Your transcript has been preserved. Please try again later."
    );
  }
}
