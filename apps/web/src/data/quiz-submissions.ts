export type QuizSubmissionStatus = "Completed" | "Incomplete";

export type QuizSubmissionAccent = "green" | "red" | "blue" | "purple" | "orange";

export interface QuizSubmissionAnswer {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizSubmission {
  id: string;
  participantName: string;
  email: string;
  initials: string;
  accent: QuizSubmissionAccent;
  submittedAt: string;
  submittedAtIso: string;
  score: number;
  totalScore: number;
  scorePercent: number;
  timeTaken: string;
  correctAnswers: number;
  totalQuestions: number;
  status: QuizSubmissionStatus;
  answers: QuizSubmissionAnswer[];
}

export interface QuizResultDetail {
  id: string;
  title: string;
  status: "Published" | "Draft";
  subject: string;
  questionCount: number;
  submissionCount: number;
  publishedAt: string;
  summary: {
    totalSubmissions: string;
    totalSubmissionsHelper: string;
    averageScore: string;
    averageScoreHelper: string;
    averageTime: string;
    averageTimeHelper: string;
    completionRate: string;
    completionRateHelper: string;
  };
  submissions: QuizSubmission[];
}

const defaultAnswers: QuizSubmissionAnswer[] = [
  {
    id: "water-symbol",
    question: "What is the chemical symbol for water?",
    userAnswer: "H2O",
    correctAnswer: "H2O",
    isCorrect: true
  },
  {
    id: "red-planet",
    question: "Which planet is known as the Red Planet?",
    userAnswer: "Earth",
    correctAnswer: "Mars",
    isCorrect: false
  },
  {
    id: "plant-gas",
    question: "What gas do plants absorb from the atmosphere?",
    userAnswer: "Carbon dioxide",
    correctAnswer: "Carbon dioxide",
    isCorrect: true
  },
  {
    id: "adult-bones",
    question: "How many bones are in the adult human body?",
    userAnswer: "206",
    correctAnswer: "206",
    isCorrect: true
  }
];

const participantRows: Array<
  Omit<QuizSubmission, "id" | "submittedAtIso" | "totalScore" | "totalQuestions" | "answers">
> = [
  {
    participantName: "Thong Anh",
    email: "thonganh@example.com",
    initials: "TA",
    accent: "green",
    submittedAt: "Apr 26, 2026, 9:15 AM",
    score: 8,
    scorePercent: 80,
    timeTaken: "6:13",
    correctAnswers: 8,
    status: "Completed"
  },
  {
    participantName: "Linh M.",
    email: "linh.m@example.com",
    initials: "LM",
    accent: "red",
    submittedAt: "Apr 26, 2026, 8:54 AM",
    score: 7,
    scorePercent: 70,
    timeTaken: "5:42",
    correctAnswers: 7,
    status: "Completed"
  },
  {
    participantName: "Hoang Nam",
    email: "nam.hoang@example.com",
    initials: "HN",
    accent: "blue",
    submittedAt: "Apr 26, 2026, 8:31 AM",
    score: 9,
    scorePercent: 90,
    timeTaken: "7:02",
    correctAnswers: 9,
    status: "Completed"
  },
  {
    participantName: "Phuong T.",
    email: "phuongt@example.com",
    initials: "PT",
    accent: "purple",
    submittedAt: "Apr 26, 2026, 8:10 AM",
    score: 6,
    scorePercent: 60,
    timeTaken: "4:58",
    correctAnswers: 6,
    status: "Completed"
  },
  {
    participantName: "Quang D.",
    email: "quangd@example.com",
    initials: "QD",
    accent: "orange",
    submittedAt: "Apr 26, 2026, 7:58 AM",
    score: 5,
    scorePercent: 50,
    timeTaken: "6:41",
    correctAnswers: 5,
    status: "Completed"
  },
  {
    participantName: "Huyen Tran",
    email: "huyen.tran@example.com",
    initials: "HT",
    accent: "green",
    submittedAt: "Apr 26, 2026, 7:42 AM",
    score: 8,
    scorePercent: 80,
    timeTaken: "5:55",
    correctAnswers: 8,
    status: "Completed"
  },
  {
    participantName: "Khanh Linh",
    email: "khanhlinh@example.com",
    initials: "KL",
    accent: "orange",
    submittedAt: "Apr 26, 2026, 7:30 AM",
    score: 7,
    scorePercent: 70,
    timeTaken: "6:20",
    correctAnswers: 7,
    status: "Completed"
  }
];

const extraNames = [
  ["Minh Chau", "minh.chau@example.com", "MC", 8, "6:01", "2026-04-26T07:20:00"],
  ["Bao Nguyen", "bao.nguyen@example.com", "BN", 9, "5:38", "2026-04-26T07:08:00"],
  ["Mai Anh", "mai.anh@example.com", "MA", 6, "6:45", "2026-04-26T06:58:00"],
  ["Tuan Kiet", "tuan.kiet@example.com", "TK", 7, "7:12", "2026-04-26T06:42:00"],
  ["Gia Han", "giahan@example.com", "GH", 8, "5:49", "2026-04-26T06:29:00"],
  ["Duc Minh", "duc.minh@example.com", "DM", 4, "4:35", "2026-04-26T06:15:00"],
  ["Nhat Vy", "nhat.vy@example.com", "NV", 10, "6:52", "2026-04-26T06:04:00"],
  ["An Nhi", "an.nhi@example.com", "AN", 7, "5:24", "2026-04-25T18:22:00"],
  ["Thanh Binh", "thanh.binh@example.com", "TB", 8, "6:18", "2026-04-25T17:50:00"],
  ["Lan Huong", "lan.huong@example.com", "LH", 5, "7:05", "2026-04-25T17:30:00"],
  ["Viet Hoang", "viet.hoang@example.com", "VH", 9, "5:57", "2026-04-25T17:05:00"],
  ["Ngoc Mai", "ngoc.mai@example.com", "NM", 8, "6:09", "2026-04-25T16:48:00"],
  ["Tran Long", "tran.long@example.com", "TL", 6, "6:33", "2026-04-25T16:12:00"],
  ["Yen Nhi", "yen.nhi@example.com", "YN", 7, "5:51", "2026-04-25T15:45:00"],
  ["Hai Dang", "hai.dang@example.com", "HD", 8, "6:27", "2026-04-25T15:22:00"],
  ["Thu Ha", "thu.ha@example.com", "TH", 9, "5:36", "2026-04-25T15:04:00"],
  ["Nam Phan", "nam.phan@example.com", "NP", 7, "6:44", "2026-04-25T14:30:00"]
] as const;

const accents: QuizSubmissionAccent[] = ["green", "red", "blue", "purple", "orange"];

function toDisplayDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function answerSetForScore(score: number): QuizSubmissionAnswer[] {
  return defaultAnswers.map((answer, index) => {
    if (index === 1) {
      return {
        ...answer,
        userAnswer: score >= 8 ? "Mars" : answer.userAnswer,
        isCorrect: score >= 8
      };
    }

    if (index === 3 && score < 6) {
      return {
        ...answer,
        userAnswer: "208",
        isCorrect: false
      };
    }

    return answer;
  });
}

const extraRows: QuizSubmission[] = extraNames.map((entry, index) => {
  const [participantName, email, initials, score, timeTaken, submittedAtIso] = entry;

  return {
    id: `submission-${index + 8}`,
    participantName,
    email,
    initials,
    accent: accents[index % accents.length],
    submittedAt: toDisplayDate(submittedAtIso),
    submittedAtIso,
    score,
    totalScore: 10,
    scorePercent: score * 10,
    timeTaken,
    correctAnswers: score,
    totalQuestions: 10,
    status: "Completed",
    answers: answerSetForScore(score)
  };
});

const quizOneSubmissions: QuizSubmission[] = [
  ...participantRows.map((row, index) => ({
    ...row,
    id: `submission-${index + 1}`,
    submittedAtIso: [
      "2026-04-26T09:15:00",
      "2026-04-26T08:54:00",
      "2026-04-26T08:31:00",
      "2026-04-26T08:10:00",
      "2026-04-26T07:58:00",
      "2026-04-26T07:42:00",
      "2026-04-26T07:30:00"
    ][index],
    totalScore: 10,
    totalQuestions: 10,
    answers: index === 0 ? defaultAnswers : answerSetForScore(row.score)
  })),
  ...extraRows
];

export const quizResultDetails: QuizResultDetail[] = [
  {
    id: "quiz-1",
    title: "Quiz 1",
    status: "Published",
    subject: "Science",
    questionCount: 10,
    submissionCount: 24,
    publishedAt: "Apr 26, 2026, 7:50 AM",
    summary: {
      totalSubmissions: "24",
      totalSubmissionsHelper: "24 unique participants",
      averageScore: "76%",
      averageScoreHelper: "18.2 / 24 points",
      averageTime: "6:13",
      averageTimeHelper: "mm:ss",
      completionRate: "100%",
      completionRateHelper: "24 / 24 completed"
    },
    submissions: quizOneSubmissions
  }
];
