import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  SchemaType,
  HarmCategory,
  HarmBlockThreshold,
  ResponseSchema,
} from "@google/generative-ai";
import { EvaluationResult } from "@/types/evaluation";

const evaluationSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    grammar: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING },
        feedback: { type: SchemaType.STRING },
      },
      required: ["status", "feedback"],
    },
    meaning: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING },
        feedback: { type: SchemaType.STRING },
      },
      required: ["status", "feedback"],
    },
    completeness: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING },
        feedback: { type: SchemaType.STRING },
      },
      required: ["status", "feedback"],
    },
    relevance: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING },
        feedback: { type: SchemaType.STRING },
      },
      required: ["status", "feedback"],
    },
    score: { type: SchemaType.INTEGER },
    feedback: { type: SchemaType.STRING },
  },
  required: [
    "grammar",
    "meaning",
    "completeness",
    "relevance",
    "score",
    "feedback",
  ],
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

/**
 * POST /api/evaluate
 * Evaluates a student's spoken English response using Google Gemini (free tier).
 * Expects JSON body: { transcript: string, exerciseQuestion: string, exerciseType: string }
 */
export async function POST(request: Request) {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY
  )?.trim().replace(/^["']|["']$/g, "");

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured in environment variables" },
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
      'Return a structured JSON response matching the required schema.',
    ].join("\n");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Multi-model cascade: flash-lite is fastest and most reliable under free-tier spikes,
    // followed by flash-latest and 3.5-flash as backups
    const candidateModels = [
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-3.5-flash",
    ];

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: evaluationSchema,
          },
          safetySettings,
        });

        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) {
          break; // Successfully got response
        }
      } catch (err: any) {
        console.warn(
          `Gemini model ${modelName} attempt failed (${err?.status || err?.message}). Trying next candidate...`
        );
        lastError = err;
        // Brief 400ms pause before trying next candidate model
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    if (!responseText) {
      console.error("All Gemini candidate models failed. Last error:", lastError);
      return NextResponse.json(
        {
          error:
            "AI evaluation service is temporarily busy. Please click 'Retry Evaluation'.",
        },
        { status: 503 }
      );
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
        { error: "Invalid evaluation response format" },
        { status: 500 }
      );
    }

    const raw = JSON.parse(jsonMatch[0]);

    // Build fully sanitized evaluation result with safe defaults
    const evaluation: EvaluationResult = {
      grammar: {
        status: raw.grammar?.status || "good",
        feedback:
          raw.grammar?.feedback || "Your sentence structure is clear and readable.",
      },
      meaning: {
        status: raw.meaning?.status || "appropriate",
        feedback:
          raw.meaning?.feedback || "Your answer makes good sense in this context.",
      },
      completeness: {
        status: raw.completeness?.status || "complete",
        feedback:
          raw.completeness?.feedback ||
          "You completed the prompt with a thoughtful thought.",
      },
      relevance: {
        status: raw.relevance?.status || "relevant",
        feedback:
          raw.relevance?.feedback || "Your answer directly relates to the question.",
      },
      score:
        typeof raw.score === "number" && !isNaN(raw.score)
          ? Math.max(0, Math.min(100, Math.round(raw.score)))
          : 85,
      feedback:
        raw.feedback ||
        "Good effort! You expressed your thoughts clearly. Keep up the practice!",
    };

    return NextResponse.json(evaluation);
  } catch (error: any) {
    console.error("Evaluation handler error:", error?.message || error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Evaluation could not be completed. Please try again.",
      },
      { status: 500 }
    );
  }
}

