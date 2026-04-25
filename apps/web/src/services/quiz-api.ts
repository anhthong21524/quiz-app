import type { Quiz } from "@quiz-app/shared";
import { httpClient } from "./http";

export interface QuizPayload {
  title: string;
  description: string;
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

