import { Quiz } from "@quiz-app/shared";

export function normalizeQuiz(document: {
  _id?: { toString(): string } | string;
  id?: string;
  title: string;
  description: string;
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
    title: document.title,
    description: document.description,
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

