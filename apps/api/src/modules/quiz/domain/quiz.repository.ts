import { Quiz, QuizStatus } from "@quiz-app/shared";

export interface CreateQuizData {
  title: string;
  description: string;
  ownerId: string;
  ownerEmail: string;
  subject?: string;
  difficulty?: Quiz["difficulty"];
  timeLimit?: number | null;
  questions: Quiz["questions"];
}

export interface UpdateQuizData {
  title?: string;
  description?: string;
  subject?: string;
  difficulty?: Quiz["difficulty"];
  timeLimit?: number | null;
  status?: QuizStatus;
  isPrivate?: boolean;
  accessCode?: string;
  questions?: Quiz["questions"];
}

export interface QuizRepository {
  create(data: CreateQuizData): Promise<Quiz>;
  findAll(ownerId: string): Promise<Quiz[]>;
  findPublished(): Promise<Quiz[]>;
  findById(id: string): Promise<Quiz | null>;
  findBySlug(slug: string): Promise<Quiz | null>;
  findByAccessCode(code: string): Promise<Quiz | null>;
  update(id: string, ownerId: string, data: UpdateQuizData): Promise<Quiz | null>;
  updateStatus(id: string, ownerId: string, status: QuizStatus): Promise<Quiz | null>;
  delete(id: string, ownerId: string): Promise<boolean>;
  duplicate(id: string, ownerId: string): Promise<Quiz | null>;
}

export const QUIZ_REPOSITORY = Symbol("QUIZ_REPOSITORY");
