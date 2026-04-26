export type QuizResultIcon =
  | "science"
  | "geography"
  | "knowledge"
  | "mathematics"
  | "technology"
  | "biology"
  | "history"
  | "chemistry";

export interface ResultSummaryMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: "users" | "clipboard" | "star" | "clock" | "check";
}

export interface QuizPerformanceResult {
  id: string;
  title: string;
  subject: string;
  questions: number;
  submissions: number;
  averageScore: string;
  scoreDetail: string;
  completionRate: string;
  completionDetail: string;
  averageTime: string;
  averageTimeHelper: string;
  lastUpdate: string;
  lastUpdateIso: string;
  lastUpdateDate: string;
  lastUpdateTime: string;
  icon: QuizResultIcon;
}

export interface RecentSubmissionResult {
  id: string;
  studentName: string;
  quizTitle: string;
  submittedAt: string;
  submittedAtIso: string;
  initials: string;
  accent: "green" | "red" | "blue" | "purple" | "orange";
}

export const resultSummaryMetrics: ResultSummaryMetric[] = [
  {
    id: "total-quizzes",
    label: "Total quizzes",
    value: "12",
    helper: "Published quizzes",
    icon: "users"
  },
  {
    id: "total-submissions",
    label: "Total submissions",
    value: "242",
    helper: "Across all quizzes",
    icon: "clipboard"
  },
  {
    id: "average-score",
    label: "Average score",
    value: "72%",
    helper: "17.3 / 24 points",
    icon: "star"
  },
  {
    id: "average-time",
    label: "Average time",
    value: "6:28",
    helper: "mm:ss",
    icon: "clock"
  },
  {
    id: "completion-rate",
    label: "Completion rate",
    value: "86%",
    helper: "208 / 242 completed",
    icon: "check"
  }
];

export const quizPerformanceResults: QuizPerformanceResult[] = [
  {
    id: "quiz-1",
    title: "Quiz 1",
    subject: "Science",
    questions: 10,
    submissions: 24,
    averageScore: "76%",
    scoreDetail: "18.2 / 24",
    completionRate: "100%",
    completionDetail: "24 / 24",
    averageTime: "6:13",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 26, 2026, 9:15 AM",
    lastUpdateIso: "2026-04-26T09:15:00",
    lastUpdateDate: "Apr 26, 2026",
    lastUpdateTime: "9:15 AM",
    icon: "science"
  },
  {
    id: "world-geography",
    title: "World Geography",
    subject: "Geography",
    questions: 15,
    submissions: 38,
    averageScore: "68%",
    scoreDetail: "17.0 / 25",
    completionRate: "89%",
    completionDetail: "34 / 38",
    averageTime: "7:02",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 25, 2026, 8:20 PM",
    lastUpdateIso: "2026-04-25T20:20:00",
    lastUpdateDate: "Apr 25, 2026",
    lastUpdateTime: "8:20 PM",
    icon: "geography"
  },
  {
    id: "general-knowledge",
    title: "General Knowledge",
    subject: "General",
    questions: 20,
    submissions: 56,
    averageScore: "72%",
    scoreDetail: "14.4 / 20",
    completionRate: "82%",
    completionDetail: "46 / 56",
    averageTime: "6:45",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 24, 2026, 6:10 PM",
    lastUpdateIso: "2026-04-24T18:10:00",
    lastUpdateDate: "Apr 24, 2026",
    lastUpdateTime: "6:10 PM",
    icon: "knowledge"
  },
  {
    id: "basic-mathematics",
    title: "Basic Mathematics",
    subject: "Math",
    questions: 12,
    submissions: 31,
    averageScore: "81%",
    scoreDetail: "19.4 / 24",
    completionRate: "90%",
    completionDetail: "28 / 31",
    averageTime: "5:48",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 24, 2026, 3:30 PM",
    lastUpdateIso: "2026-04-24T15:30:00",
    lastUpdateDate: "Apr 24, 2026",
    lastUpdateTime: "3:30 PM",
    icon: "mathematics"
  },
  {
    id: "computer-basics",
    title: "Computer Basics",
    subject: "Technology",
    questions: 10,
    submissions: 0,
    averageScore: "-",
    scoreDetail: "- / 20",
    completionRate: "0%",
    completionDetail: "0 / 0",
    averageTime: "-",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 20, 2026, 11:40 AM",
    lastUpdateIso: "2026-04-20T11:40:00",
    lastUpdateDate: "Apr 20, 2026",
    lastUpdateTime: "11:40 AM",
    icon: "technology"
  },
  {
    id: "biology-fundamentals",
    title: "Biology Fundamentals",
    subject: "Science",
    questions: 18,
    submissions: 42,
    averageScore: "74%",
    scoreDetail: "16.6 / 22",
    completionRate: "88%",
    completionDetail: "37 / 42",
    averageTime: "6:31",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 19, 2026, 9:05 AM",
    lastUpdateIso: "2026-04-19T09:05:00",
    lastUpdateDate: "Apr 19, 2026",
    lastUpdateTime: "9:05 AM",
    icon: "biology"
  },
  {
    id: "history-of-vietnam",
    title: "History of Vietnam",
    subject: "History",
    questions: 15,
    submissions: 28,
    averageScore: "69%",
    scoreDetail: "13.8 / 20",
    completionRate: "79%",
    completionDetail: "22 / 28",
    averageTime: "7:15",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 18, 2026, 4:55 PM",
    lastUpdateIso: "2026-04-18T16:55:00",
    lastUpdateDate: "Apr 18, 2026",
    lastUpdateTime: "4:55 PM",
    icon: "history"
  },
  {
    id: "chemistry-basics",
    title: "Chemistry Basics",
    subject: "Science",
    questions: 14,
    submissions: 23,
    averageScore: "77%",
    scoreDetail: "16.9 / 22",
    completionRate: "87%",
    completionDetail: "20 / 23",
    averageTime: "6:05",
    averageTimeHelper: "mm:ss",
    lastUpdate: "Apr 17, 2026, 2:25 PM",
    lastUpdateIso: "2026-04-17T14:25:00",
    lastUpdateDate: "Apr 17, 2026",
    lastUpdateTime: "2:25 PM",
    icon: "chemistry"
  }
];

export const recentSubmissionResults: RecentSubmissionResult[] = [
  {
    id: "submission-thong-anh",
    studentName: "Thong Anh",
    quizTitle: "Quiz 1",
    submittedAt: "Apr 26, 2026, 9:15 AM",
    submittedAtIso: "2026-04-26T09:15:00",
    initials: "TA",
    accent: "green"
  },
  {
    id: "submission-linh-m",
    studentName: "Linh M.",
    quizTitle: "World Geography",
    submittedAt: "Apr 26, 2026, 8:54 AM",
    submittedAtIso: "2026-04-26T08:54:00",
    initials: "LM",
    accent: "red"
  },
  {
    id: "submission-hoang-nam",
    studentName: "Hoang Nam",
    quizTitle: "General Knowledge",
    submittedAt: "Apr 26, 2026, 8:31 AM",
    submittedAtIso: "2026-04-26T08:31:00",
    initials: "HN",
    accent: "blue"
  },
  {
    id: "submission-phuong-t",
    studentName: "Phuong T.",
    quizTitle: "Basic Mathematics",
    submittedAt: "Apr 26, 2026, 8:10 AM",
    submittedAtIso: "2026-04-26T08:10:00",
    initials: "PT",
    accent: "purple"
  },
  {
    id: "submission-quang-d",
    studentName: "Quang D.",
    quizTitle: "Biology Fundamentals",
    submittedAt: "Apr 26, 2026, 7:58 AM",
    submittedAtIso: "2026-04-26T07:58:00",
    initials: "QD",
    accent: "orange"
  }
];
