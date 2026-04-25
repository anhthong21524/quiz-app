import { QuizStatus, type Quiz } from "@quiz-app/shared";
import { httpClient } from "./http";

export interface PublicQuizInfo {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number | null;
  questionType: string;
  isPublished: boolean;
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
  timeLimit: number | null;
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
  timeLimit?: number | null;
}

function isPublicQuizApiResponse(data: unknown): data is PublicQuizApiResponse {
  return typeof data === "object" && data !== null && "title" in data;
}

const demoPublicQuizzes: Record<string, PublicQuizInfo> = {
  "general-knowledge-quiz": {
    id: "general-knowledge-quiz",
    slug: "general-knowledge-quiz",
    title: "General Knowledge Quiz",
    description:
      "Test your knowledge with 10 multiple-choice questions covering a variety of general topics.",
    questionCount: 10,
    timeLimit: 15,
    questionType: "Multiple Choice",
    isPublished: true
  }
};

function normalizeQuiz(data: PublicQuizApiResponse, fallbackSlug: string): PublicQuizInfo {
  const id = data.id ?? data._id ?? fallbackSlug;
  const questionCount = data.questionCount ?? data.questions?.length ?? 0;
  const isPublished = data.isPublished ?? data.status === QuizStatus.PUBLISHED;

  return {
    id,
    slug: data.slug ?? fallbackSlug,
    title: data.title,
    description: data.description ?? "",
    questionCount,
    timeLimit: data.timeLimit ?? null,
    questionType: data.questionType ?? "Multiple Choice",
    isPublished
  };
}

function fallbackQuizBySlug(slug: string): PublicQuizInfo | null {
  return demoPublicQuizzes[slug] ?? null;
}

export async function getPublicQuizBySlug(slug: string): Promise<PublicQuizInfo | null> {
  try {
    const response = await httpClient.get<unknown>(`/quizzes/slug/${slug}`);
    if (!isPublicQuizApiResponse(response.data)) {
      throw new Error("Public quiz endpoint returned an incompatible response.");
    }

    return normalizeQuiz(response.data, slug);
  } catch {
    // TODO: Replace this fallback after the API exposes a public slug endpoint.
  }

  try {
    const response = await httpClient.get<unknown>(`/quizzes/${slug}`);
    if (!isPublicQuizApiResponse(response.data)) {
      throw new Error("Quiz endpoint returned an incompatible response.");
    }

    return normalizeQuiz(response.data, slug);
  } catch {
    // TODO: Remove this compatibility path once slugs are first-class in the API.
  }

  return fallbackQuizBySlug(slug);
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
      startedAt: data.startedAt ?? new Date().toISOString(),
      timeLimit: data.timeLimit ?? null
    };
  } catch {
    // TODO: Replace the local attempt with the API response when public attempts are available.
    return {
      id: crypto.randomUUID(),
      quizId: payload.quizId,
      takerName: payload.takerName,
      startedAt: new Date().toISOString(),
      timeLimit: null
    };
  }
}
