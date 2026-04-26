export type QuizSubmissionStatus = "Completed" | "Incomplete";

export interface QuizSubmission {
  id: string;
  participantName: string;
  participantEmail: string;
  submittedAt: string;
  score: number;
  totalScore: number;
  scorePercent: number;
  timeTaken: string;
  correctAnswers: number;
  totalQuestions: number;
  status: QuizSubmissionStatus;
}

export interface QuizResultSummary {
  quizId: string;
  quizTitle: string;
  status: "published" | "draft";
  category: string;
  totalQuestions: number;
  totalSubmissions: number;
  uniqueParticipants: number;
  averageScorePercent: number;
  averageScoreText: string;
  averageTime: string;
  completionRate: number;
  completedCount: number;
}
