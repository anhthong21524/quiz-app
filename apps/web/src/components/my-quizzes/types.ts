export type ViewMode = "list" | "grid";
export type MyQuizStatus = "Published" | "In progress" | "Unpublished";

export type MyQuizIcon =
  | "mathematics"
  | "science"
  | "geography"
  | "knowledge"
  | "english"
  | "physics"
  | "history";

export interface QuizListItem {
  id: string;
  apiId?: string;
  slug?: string;
  title: string;
  subject: string;
  questions: number;
  status: MyQuizStatus;
  lastUpdated: string;
  lastUpdatedLabel: string;
  icon: MyQuizIcon;
  isPrivate?: boolean;
  accessCode?: string;
  isExposed?: boolean;
}
