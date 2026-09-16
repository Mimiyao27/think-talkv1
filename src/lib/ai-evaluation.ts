import puter from "@heyputer/puter.js";
import { Exercise } from "@/types/exercise";
import { EvaluationResult } from "@/types/evaluation";

export async function evaluateResponse(exercise: Exercise, transcript: string): Promise<EvaluationResult> {
  const isOpenEnded = exercise.type === "open-ended";

  const prompt = `You are an encouraging English learning assistant for Grade 7 students.

Evaluate the student's spoken English response.

Exercise (${isOpenEnded ? 'Open-ended Question' : 'Fill-in-the-blank'}):
"${exercise.question}"

Student's answer:
"${transcript}"

Evaluate:
1. Grammar
2. Meaning / Clarity
3. Completeness
4. Relevance to the exercise

Important:
${isOpenEnded 
  ? `This is an open-ended question. There are many valid answers.
Evaluate the student on clarity, grammar, relevance, and completeness of their thought.
Do NOT compare their answer against one fixed answer.` 
  : `The blank can have multiple valid answers. Do NOT require the student to use one predetermined word. Evaluate the whole sentence. Do not penalize a student simply because they used a different valid word.`
}
Consider minor spelling/transcription errors that may come from speech recognition (e.g. 'bark' instead of 'park').
Use contextual reasoning.

Return a structured JSON response EXACTLY matching this format (no markdown blocks, just raw JSON):
{
  "grammar": {
    "status": "good",
    "feedback": "The sentence is grammatically correct."
  },
  "meaning": {
    "status": "appropriate",
    "feedback": "The answer makes sense and appropriately completes the sentence."
  },
  "completeness": {
    "status": "complete",
    "feedback": "The student completed the entire sentence."
  },
  "relevance": {
    "status": "relevant",
    "feedback": "The answer directly responds to the exercise."
  },
  "score": 90,
  "feedback": "Great job! Your sentence is clear and meaningful."
}`;

  try {
    const response = await puter.ai.chat(prompt, { response_format: 'json' });
    let resultText = "";
    
    // Handle different possible response formats from Puter SDK
    if (typeof response === "string") {
      resultText = response;
    } else if (response && response.message && response.message.content) {
      resultText = response.message.content;
    } else if (response && response.text) {
      resultText = response.text;
    } else {
      throw new Error("Invalid response format from Puter AI");
    }

    // Sometimes the AI wraps the JSON in markdown blocks even when told not to.
    const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();

    const evaluation = JSON.parse(cleanedText) as EvaluationResult;
    return evaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error("We couldn't evaluate your answer right now. Your transcript has been preserved. Please try again later.");
  }
}
