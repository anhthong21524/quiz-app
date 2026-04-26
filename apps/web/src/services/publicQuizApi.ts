import { QuizStatus, type Question, type Quiz } from "@quiz-app/shared";
import { httpClient } from "./http";

export type PublicQuizQuestion = Question;

export interface PublicQuizInfo {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number | null;
  questionType: string;
  isPublished: boolean;
  questions: PublicQuizQuestion[];
}

export interface CreateQuizAttemptPayload {
  quizId: string;
  takerName: string;
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  takerName: string;
  startedAt: string;
}

interface PublicQuizApiResponse {
  id?: string;
  _id?: string;
  slug?: string;
  title: string;
  description?: string;
  questionCount?: number;
  questions?: Quiz["questions"];
  timeLimit?: number | null;
  questionType?: string;
  status?: QuizStatus | string;
  isPublished?: boolean;
}

interface QuizAttemptApiResponse {
  id?: string;
  _id?: string;
  attemptId?: string;
  quizId?: string;
  takerName?: string;
  startedAt?: string;
}

function isPublicQuizApiResponse(data: unknown): data is PublicQuizApiResponse {
  return typeof data === "object" && data !== null && "title" in data;
}

function isPublicQuizApiResponseList(data: unknown): data is PublicQuizApiResponse[] {
  return Array.isArray(data) && data.every(isPublicQuizApiResponse);
}

function slugifyTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeQuiz(data: PublicQuizApiResponse, fallbackSlug: string): PublicQuizInfo {
  const id = data.id ?? data._id ?? fallbackSlug;
  const questionCount = data.questionCount ?? data.questions?.length ?? 0;
  const isPublished = data.isPublished ?? data.status === QuizStatus.PUBLISHED;
  const slug = data.slug ?? id ?? slugifyTitle(data.title) ?? fallbackSlug;

  return {
    id,
    slug,
    title: data.title,
    description: data.description ?? "",
    questionCount,
    timeLimit: data.timeLimit ?? null,
    questionType: data.questionType ?? "Multiple Choice",
    isPublished,
    questions: data.questions ?? []
  };
}

export async function getPublicQuizzes(): Promise<PublicQuizInfo[]> {
  const response = await httpClient.get<unknown>("/quizzes/public");
  if (!isPublicQuizApiResponseList(response.data)) {
    throw new Error("Public quizzes endpoint returned an incompatible response.");
  }

  return response.data
    .map((quiz) => normalizeQuiz(quiz, quiz.slug ?? quiz.id ?? quiz._id ?? slugifyTitle(quiz.title)))
    .filter((quiz) => quiz.isPublished);
}

export async function getPublicQuizBySlug(slug: string): Promise<PublicQuizInfo | null> {
  try {
    const response = await httpClient.get<unknown>(`/quizzes/slug/${slug}`);
    if (!isPublicQuizApiResponse(response.data)) {
      throw new Error("Public quiz endpoint returned an incompatible response.");
    }

    return normalizeQuiz(response.data, slug);
  } catch {
    // Compatibility path for API data created before slugs were first-class.
  }

  try {
    const response = await httpClient.get<unknown>(`/quizzes/${slug}`);
    if (!isPublicQuizApiResponse(response.data)) {
      throw new Error("Quiz endpoint returned an incompatible response.");
    }

    return normalizeQuiz(response.data, slug);
  } catch {
    return null;
  }
}

export interface SubmitAttemptPayload {
  quizId: string;
  attemptId: string;
  answers: Record<string, number>;
  timeTaken: number;
}

export interface SubmitAttemptResult {
  score: number;
  submittedAt: string;
}

export async function submitQuizAttempt(
  payload: SubmitAttemptPayload
): Promise<SubmitAttemptResult | null> {
  try {
    const response = await httpClient.post<{
      score?: number;
      submittedAt?: string;
    }>(`/quizzes/${payload.quizId}/attempts/${payload.attemptId}/submit`, {
      answers: payload.answers,
      timeTaken: payload.timeTaken
    });
    const data = response.data;
    if (data.score === undefined) return null;
    return {
      score: data.score,
      submittedAt: data.submittedAt ?? new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export async function createQuizAttempt(
  payload: CreateQuizAttemptPayload
): Promise<QuizAttemptResponse> {
  try {
    const response = await httpClient.post<QuizAttemptApiResponse>(
      `/quizzes/${payload.quizId}/attempts`,
      { takerName: payload.takerName }
    );
    const data = response.data;

    return {
      id: data.id ?? data._id ?? data.attemptId ?? crypto.randomUUID(),
      quizId: data.quizId ?? payload.quizId,
      takerName: data.takerName ?? payload.takerName,
      startedAt: data.startedAt ?? new Date().toISOString()
    };
  } catch {
    // TODO: Replace the local attempt with the API response when public attempts are available.
    return {
      id: crypto.randomUUID(),
      quizId: payload.quizId,
      takerName: payload.takerName,
      startedAt: new Date().toISOString()
    };
  }
}
