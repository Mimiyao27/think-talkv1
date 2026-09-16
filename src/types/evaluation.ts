export interface EvaluationFeedback {
  status: string;
  feedback: string;
}

export interface EvaluationResult {
  grammar: EvaluationFeedback;
  meaning: EvaluationFeedback;
  completeness: EvaluationFeedback;
  relevance: EvaluationFeedback;
  score: number;
  feedback: string;
}
