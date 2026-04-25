import { Quiz } from "@quiz-app/shared";

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeQuiz(document: {
  _id?: { toString(): string } | string;
  id?: string;
  slug?: string;
  title: string;
  description: string;
  ownerId?: string;
  ownerEmail?: string;
  subject?: string;
  difficulty?: Quiz["difficulty"];
  timeLimit?: number | null;
  status: Quiz["status"];
  questions: Quiz["questions"];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}): Quiz {
  return {
    id:
      document.id ??
      (typeof document._id === "string"
        ? document._id
        : document._id?.toString()),
    slug: document.slug ?? slugifyTitle(document.title),
    title: document.title,
    description: document.description,
    ownerId: document.ownerId,
    ownerEmail: document.ownerEmail,
    subject: document.subject,
    difficulty: document.difficulty,
    timeLimit: document.timeLimit ?? null,
    status: document.status,
    questions: document.questions,
    createdAt: document.createdAt
      ? new Date(document.createdAt).toISOString()
      : undefined,
    updatedAt: document.updatedAt
      ? new Date(document.updatedAt).toISOString()
      : undefined
  };
}
