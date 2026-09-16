/* eslint-disable @typescript-eslint/no-explicit-any */
import { Exercise } from "@/types/exercise";
import { EvaluationResult } from "@/types/evaluation";

// Puter.js is loaded as a global script, not a module.
// We access it via the global `puter` object on the window.
declare const puter: any;

export async function evaluateResponse(
  exercise: Exercise,
  transcript: string
): Promise<EvaluationResult> {
  const isOpenEnded = exercise.type === "open-ended";

  const importanceNote = isOpenEnded
    ? "This is an open-ended question. There are many valid answers. Evaluate the student on clarity, grammar, relevance, and completeness of their thought. Do NOT compare their answer against one fixed answer."
    : "The blank can have multiple valid answers. Do NOT require the student to use one predetermined word. Evaluate the whole sentence. Do not penalize a student simply because they used a different valid word.";

  const prompt = [
    "You are an encouraging English learning assistant for Grade 7 students.",
    "",
    "Evaluate the student's spoken English response.",
    "",
    `Exercise (${isOpenEnded ? "Open-ended Question" : "Fill-in-the-blank"}):`,
    `"${exercise.question}"`,
    "",
    "Student's answer:",
    `"${transcript}"`,
    "",
    "Evaluate:",
    "1. Grammar",
    "2. Meaning / Clarity",
    "3. Completeness",
    "4. Relevance to the exercise",
    "",
    "Important:",
    importanceNote,
    "Consider minor spelling/transcription errors that may come from speech recognition (e.g. 'bark' instead of 'park').",
    "Use contextual reasoning.",
    "Feedback must be encouraging, simple, and appropriate for Grade 7 students.",
    "",
    'Return a structured JSON response EXACTLY matching this format (no markdown, just raw JSON):',
    "{",
    '  "grammar": { "status": "good", "feedback": "The sentence is grammatically correct." },',
    '  "meaning": { "status": "appropriate", "feedback": "The answer makes sense." },',
    '  "completeness": { "status": "complete", "feedback": "The student completed the entire sentence." },',
    '  "relevance": { "status": "relevant", "feedback": "The answer directly responds to the exercise." },',
    '  "score": 90,',
    '  "feedback": "Great job! Your sentence is clear and meaningful."',
    "}",
  ].join("\n");

  try {
    const response = await puter.ai.chat(prompt);
    let resultText = "";

    // Handle different possible response shapes from Puter SDK
    if (typeof response === "string") {
      resultText = response;
    } else if (response?.message?.content) {
      const content = response.message.content;
      // content may be a string or an array of content parts
      if (typeof content === "string") {
        resultText = content;
      } else if (Array.isArray(content)) {
        resultText = content.map((c: any) => c.text ?? "").join("");
      }
    } else if (response?.text) {
      resultText = response.text;
    } else {
      throw new Error("Invalid response format from Puter AI");
    }

    // Strip any markdown code fences the AI might wrap around the JSON
    const cleanedText = resultText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object if there's surrounding text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in AI response");
    }

    const evaluation = JSON.parse(jsonMatch[0]) as EvaluationResult;
    return evaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error(
      "We couldn't evaluate your answer right now. Your transcript has been preserved. Please try again later."
    );
  }
}
