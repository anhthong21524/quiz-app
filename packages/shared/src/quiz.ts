export enum QuizStatus {
  IN_PROGRESS = "in_progress",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished"
}

export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id?: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  ownerId?: string;
  ownerEmail?: string;
  subject?: string;
  difficulty?: QuizDifficulty;
  timeLimit?: number | null;
  status: QuizStatus;
  isPrivate?: boolean;
  accessCode?: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}
