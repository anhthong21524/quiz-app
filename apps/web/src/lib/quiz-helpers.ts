import { QuizStatus } from "@quiz-app/shared";
import type { MyQuizIcon, MyQuizStatus } from "../components/my-quizzes/types";

export function getQuizIcon(subject?: string): MyQuizIcon {
  const s = subject?.trim().toLowerCase() ?? "";
  if (s.includes("math")) return "mathematics";
  if (s.includes("science") || s.includes("chem")) return "science";
  if (s.includes("geo")) return "geography";
  if (s.includes("english") || s.includes("grammar")) return "english";
  if (s.includes("physics")) return "physics";
  if (s.includes("history")) return "history";
  return "knowledge";
}

export function mapQuizStatus(status: QuizStatus): MyQuizStatus {
  if (status === QuizStatus.PUBLISHED) return "Published";
  if (status === QuizStatus.IN_PROGRESS) return "In progress";
  return "Unpublished";
}
