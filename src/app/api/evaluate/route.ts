import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/evaluate
 * Evaluates a student's spoken English response using Google Gemini (free tier).
 * Expects JSON body: { transcript: string, exerciseQuestion: string, exerciseType: string }
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { transcript, exerciseQuestion, exerciseType } = await request.json();

    if (!transcript || !exerciseQuestion) {
      return NextResponse.json(
        { error: "Missing transcript or exerciseQuestion" },
        { status: 400 }
      );
    }

    const isOpenEnded = exerciseType === "open-ended";

    const importanceNote = isOpenEnded
      ? "This is an open-ended question. There are many valid answers. Evaluate the student on clarity, grammar, relevance, and completeness of their thought. Do NOT compare their answer against one fixed answer."
      : "The blank can have multiple valid answers. Do NOT require the student to use one predetermined word. Evaluate the whole sentence. Do not penalize a student simply because they used a different valid word.";

    const prompt = [
      "You are an encouraging English learning assistant for Grade 7 students.",
      "",
      "Evaluate the student's spoken English response.",
      "",
      `Exercise (${isOpenEnded ? "Open-ended Question" : "Fill-in-the-blank"}):`,
      `"${exerciseQuestion}"`,
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

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-flash-latest with fallback to gemini-flash-lite-latest
    let responseText = "";
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (primaryErr) {
      console.warn("gemini-flash-latest failed, trying gemini-flash-lite-latest:", primaryErr);
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-flash-lite-latest",
        generationConfig: { responseMimeType: "application/json" },
      });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      responseText = fallbackResult.response.text();
    }

    // Strip any markdown code fences the AI might wrap around the JSON
    const cleanedText = responseText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object if there's surrounding text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in Gemini response:", cleanedText);
      return NextResponse.json(
        { error: "Invalid evaluation response" },
        { status: 500 }
      );
    }

    const evaluation = JSON.parse(jsonMatch[0]);
    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Evaluation error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Failed to evaluate response" },
      { status: 500 }
    );
  }
}

