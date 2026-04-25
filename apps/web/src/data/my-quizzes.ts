export type MyQuizStatus = "Published" | "In progress" | "Unpublished";

export type MyQuizIcon =
  | "mathematics"
  | "science"
  | "geography"
  | "knowledge"
  | "english"
  | "physics"
  | "history";

export interface MyQuiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  status: MyQuizStatus;
  lastUpdated: string;
  lastUpdatedLabel: string;
  icon: MyQuizIcon;
}

export const myQuizzes: MyQuiz[] = [
  {
    id: "mathematics-quiz-1",
    title: "Mathematics Quiz #1",
    subject: "Mathematics",
    questions: 20,
    status: "Published",
    lastUpdated: "2024-05-15T14:30:00",
    lastUpdatedLabel: "May 15, 2024 \u00b7 2:30 PM",
    icon: "mathematics"
  },
  {
    id: "chemistry-basics",
    title: "Chemistry Basics",
    subject: "Science",
    questions: 15,
    status: "In progress",
    lastUpdated: "2024-05-14T11:45:00",
    lastUpdatedLabel: "May 14, 2024 \u00b7 11:45 AM",
    icon: "science"
  },
  {
    id: "world-capitals-quiz",
    title: "World Capitals Quiz",
    subject: "Geography",
    questions: 10,
    status: "Published",
    lastUpdated: "2024-05-13T09:20:00",
    lastUpdatedLabel: "May 13, 2024 \u00b7 9:20 AM",
    icon: "geography"
  },
  {
    id: "general-knowledge",
    title: "General Knowledge",
    subject: "General Knowledge",
    questions: 25,
    status: "Unpublished",
    lastUpdated: "2024-05-10T16:15:00",
    lastUpdatedLabel: "May 10, 2024 \u00b7 4:15 PM",
    icon: "knowledge"
  },
  {
    id: "english-grammar-test",
    title: "English Grammar Test",
    subject: "English",
    questions: 18,
    status: "In progress",
    lastUpdated: "2024-05-08T10:05:00",
    lastUpdatedLabel: "May 8, 2024 \u00b7 10:05 AM",
    icon: "english"
  },
  {
    id: "physics-fundamentals",
    title: "Physics Fundamentals",
    subject: "Science",
    questions: 22,
    status: "Published",
    lastUpdated: "2024-05-05T15:40:00",
    lastUpdatedLabel: "May 5, 2024 \u00b7 3:40 PM",
    icon: "physics"
  },
  {
    id: "history-of-ancient-rome",
    title: "History of Ancient Rome",
    subject: "History",
    questions: 12,
    status: "Unpublished",
    lastUpdated: "2024-05-01T13:20:00",
    lastUpdatedLabel: "May 1, 2024 \u00b7 1:20 PM",
    icon: "history"
  }
];
