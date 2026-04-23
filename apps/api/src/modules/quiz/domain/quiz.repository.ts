import { Quiz, QuizStatus } from "@quiz-app/shared";

export interface CreateQuizData {
  title: string;
  description: string;
  questions: Quiz["questions"];
}

export interface UpdateQuizData {
  title?: string;
  description?: string;
  status?: QuizStatus;
  questions?: Quiz["questions"];
}

export interface QuizRepository {
  create(data: CreateQuizData): Promise<Quiz>;
  findAll(): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  update(id: string, data: UpdateQuizData): Promise<Quiz | null>;
  updateStatus(id: string, status: QuizStatus): Promise<Quiz | null>;
}

export const QUIZ_REPOSITORY = Symbol("QUIZ_REPOSITORY");
