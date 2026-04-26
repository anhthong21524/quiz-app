import type { Quiz } from "@quiz-app/shared";
import { httpClient } from "./http";

export interface ResultsSummary {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
}

export interface QuizPerformanceItem {
  id: string;
  title: string;
  subject: string;
  status: string;
  questionCount: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
  lastSubmittedAt: string | null;
}

export interface RecentSubmissionItem {
  id: string;
  takerName: string;
  quizId: string;
  quizTitle: string;
  submittedAt: string;
}

export interface SubmissionAnswerResult {
  questionId: string;
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface SubmissionResult {
  id: string;
  takerName: string;
  startedAt: string;
  submittedAt: string | null;
  timeTaken: number | null;
  score: number | null;
  status: "Completed" | "Incomplete";
  answers: SubmissionAnswerResult[];
}

export interface QuizResultDetail {
  id: string;
  title: string;
  subject: string;
  status: string;
  questionCount: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
  submissions: SubmissionResult[];
}

export interface QuizPayload {
  title: string;
  description: string;
  subject?: string;
  difficulty?: Quiz["difficulty"];
  timeLimit?: number | null;
  questions: Quiz["questions"];
}

export async function fetchQuizzes() {
  const response = await httpClient.get<Quiz[]>("/quizzes");
  return response.data;
}

export async function fetchQuiz(id: string) {
  const response = await httpClient.get<Quiz>(`/quizzes/${id}`);
  return response.data;
}

export async function createQuiz(payload: QuizPayload) {
  const response = await httpClient.post<Quiz>("/quizzes", payload);
  return response.data;
}

export async function updateQuiz(id: string, payload: QuizPayload) {
  const response = await httpClient.patch<Quiz>(`/quizzes/${id}`, payload);
  return response.data;
}

export async function publishQuiz(id: string) {
  const response = await httpClient.patch<Quiz>(`/quizzes/${id}/publish`);
  return response.data;
}

export async function unpublishQuiz(id: string) {
  const response = await httpClient.patch<Quiz>(`/quizzes/${id}/unpublish`);
  return response.data;
}

export async function deleteQuiz(id: string): Promise<void> {
  await httpClient.delete(`/quizzes/${id}`);
}

export async function duplicateQuiz(id: string): Promise<Quiz> {
  const response = await httpClient.post<Quiz>(`/quizzes/${id}/duplicate`);
  return response.data;
}

export async function fetchResultsSummary(): Promise<ResultsSummary> {
  const response = await httpClient.get<ResultsSummary>("/quizzes/results/summary");
  return response.data;
}

export async function fetchQuizPerformance(): Promise<QuizPerformanceItem[]> {
  const response = await httpClient.get<QuizPerformanceItem[]>("/quizzes/results/performance");
  return response.data;
}

export async function fetchRecentSubmissions(limit = 5): Promise<RecentSubmissionItem[]> {
  const response = await httpClient.get<RecentSubmissionItem[]>("/quizzes/results/recent", {
    params: { limit }
  });
  return response.data;
}

export async function fetchQuizResultDetail(quizId: string): Promise<QuizResultDetail> {
  const response = await httpClient.get<QuizResultDetail>(`/quizzes/${quizId}/results`);
  return response.data;
}
