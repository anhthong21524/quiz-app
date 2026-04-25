import type { QuizStatus } from "@quiz-app/shared";
import type { MyQuiz } from "../../data/my-quizzes";

export type ViewMode = "list" | "grid";
export type QuizSource = "seeded" | "api";

export interface QuizListItem extends MyQuiz {
  source: QuizSource;
  apiId?: string;
  apiStatus?: QuizStatus;
}
