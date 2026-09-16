export interface Exercise {
  id: string;
  question: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  gradeLevel: number;
  category: string;
  type?: "fill-in-the-blank" | "open-ended";
}
