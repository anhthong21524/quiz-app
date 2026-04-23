export enum QuizStatus {
  IN_PROGRESS = "in_progress",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished"
}

export interface Question {
  id?: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  status: QuizStatus;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

