export type QuizResultIcon =
  | "science"
  | "geography"
  | "knowledge"
  | "mathematics"
  | "technology"
  | "biology"
  | "history"
  | "chemistry";

export interface ResultSummaryMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: "users" | "clipboard" | "star" | "clock" | "check";
}

export interface QuizPerformanceResult {
  id: string;
  title: string;
  subject: string;
  questions: number;
  submissions: number;
  averageScore: string;
  scoreDetail: string;
  completionRate: string;
  completionDetail: string;
  averageTime: string;
  averageTimeHelper: string;
  lastUpdate: string;
  lastUpdateIso: string;
  lastUpdateDate: string;
  lastUpdateTime: string;
  icon: QuizResultIcon;
}

export interface RecentSubmissionResult {
  id: string;
  studentName: string;
  quizTitle: string;
  submittedAt: string;
  submittedAtIso: string;
  initials: string;
  accent: "green" | "red" | "blue" | "purple" | "orange";
  scorePercent: number | null;
}
