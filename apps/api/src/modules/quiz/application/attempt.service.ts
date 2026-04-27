import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QuizStatus, type Quiz } from "@quiz-app/shared";
import { ATTEMPT_REPOSITORY, AttemptRepository } from "../domain/attempt.repository";
import { QuizAttempt } from "../domain/quiz-attempt";
import { QUIZ_REPOSITORY, QuizRepository } from "../domain/quiz.repository";
import { AuthenticatedUser } from "./quiz.service";

export interface SubmissionAnswerResult {
  questionId: string;
  question: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}

export interface SubmissionResult {
  id: string;
  takerName: string;
  startedAt: string;
  submittedAt: string | null;
  timeTaken: number | null;
  score: number | null;
  status: "Completed" | "Incomplete";
  answers: SubmissionAnswerResult[];
}

export interface QuizResultDetail {
  id: string;
  title: string;
  subject: string;
  status: string;
  questionCount: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
  submissions: SubmissionResult[];
}

export interface QuizPerformanceItem {
  id: string;
  title: string;
  subject: string;
  status: string;
  questionCount: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
  lastSubmittedAt: string | null;
}

export interface ResultsSummary {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalSubmissions: number;
  completedSubmissions: number;
  averageScorePercent: number | null;
  totalCorrect: number;
  totalPossible: number;
  averageTimeSecs: number | null;
}

export interface RecentSubmissionItem {
  id: string;
  takerName: string;
  quizId: string;
  quizTitle: string;
  submittedAt: string;
  scorePercent: number | null;
}

@Injectable()
export class AttemptService {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: AttemptRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepository
  ) {}

  async createAttempt(quizId: string, takerName: string): Promise<QuizAttempt> {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundException(`Quiz ${quizId} was not found.`);
    return this.attemptRepository.create(quizId, takerName);
  }

  async submitAttempt(
    quizId: string,
    attemptId: string,
    answers: Record<string, number>,
    timeTaken: number
  ): Promise<QuizAttempt> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt || attempt.quizId !== quizId) {
      throw new NotFoundException(`Attempt ${attemptId} was not found.`);
    }

    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundException(`Quiz ${quizId} was not found.`);

    const score = this.calculateScore(quiz, answers);
    const submitted = await this.attemptRepository.submit(attemptId, answers, score, timeTaken);
    if (!submitted) throw new NotFoundException(`Attempt ${attemptId} was not found.`);
    return submitted;
  }

  async getResultsSummary(user: AuthenticatedUser): Promise<ResultsSummary> {
    const quizzes = await this.quizRepository.findAll(user.id);
    const quizIds = quizzes.map((q) => q.id!).filter(Boolean);
    const attempts = await this.attemptRepository.findByQuizIds(quizIds);

    const completed = attempts.filter((a) => a.submittedAt && a.score != null);
    const totalCorrect = completed.reduce((sum, a) => sum + (a.score ?? 0), 0);
    const totalPossible = completed.reduce((sum, a) => {
      const quiz = quizzes.find((q) => q.id === a.quizId);
      return sum + (quiz?.questions.length ?? 0);
    }, 0);
    const totalTimeSecs = completed.reduce((sum, a) => sum + (a.timeTaken ?? 0), 0);

    return {
      totalQuizzes: quizzes.length,
      publishedQuizzes: quizzes.filter((q) => q.status === QuizStatus.PUBLISHED).length,
      totalSubmissions: attempts.length,
      completedSubmissions: completed.length,
      averageScorePercent: totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : null,
      totalCorrect,
      totalPossible,
      averageTimeSecs: completed.length > 0 ? Math.round(totalTimeSecs / completed.length) : null
    };
  }

  async getQuizPerformance(user: AuthenticatedUser): Promise<QuizPerformanceItem[]> {
    const quizzes = await this.quizRepository.findAll(user.id);
    const quizIds = quizzes.map((q) => q.id!).filter(Boolean);
    const attempts = await this.attemptRepository.findByQuizIds(quizIds);

    const attemptsByQuiz = new Map<string, QuizAttempt[]>();
    for (const attempt of attempts) {
      const list = attemptsByQuiz.get(attempt.quizId) ?? [];
      list.push(attempt);
      attemptsByQuiz.set(attempt.quizId, list);
    }

    return quizzes.map((quiz) => {
      const quizAttempts = attemptsByQuiz.get(quiz.id!) ?? [];
      return this.buildPerformanceItem(quiz, quizAttempts);
    });
  }

  async getRecentSubmissions(user: AuthenticatedUser, limit: number): Promise<RecentSubmissionItem[]> {
    const quizzes = await this.quizRepository.findAll(user.id);
    const quizIds = quizzes.map((q) => q.id!).filter(Boolean);
    const quizMap = new Map(quizzes.map((q) => [q.id!, q]));
    const recent = await this.attemptRepository.findRecent(quizIds, limit);

    return recent.map((attempt) => {
      const quiz = quizMap.get(attempt.quizId);
      const questionCount = quiz?.questions?.length ?? 0;
      const scorePercent =
        attempt.score != null && questionCount > 0
          ? Math.round((attempt.score / questionCount) * 100)
          : null;
      return {
        id: attempt.id,
        takerName: attempt.takerName,
        quizId: attempt.quizId,
        quizTitle: quiz?.title ?? "Unknown Quiz",
        submittedAt: attempt.submittedAt!,
        scorePercent,
      };
    });
  }

  async getQuizResults(quizId: string, user: AuthenticatedUser): Promise<QuizResultDetail> {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) throw new NotFoundException(`Quiz ${quizId} was not found.`);
    if (quiz.ownerId !== user.id) throw new NotFoundException(`Quiz ${quizId} was not found.`);

    const attempts = await this.attemptRepository.findByQuizId(quizId);
    const completed = attempts.filter((a) => a.submittedAt && a.score != null);
    const totalCorrect = completed.reduce((sum, a) => sum + (a.score ?? 0), 0);
    const totalPossible = completed.length * quiz.questions.length;
    const totalTimeSecs = completed.reduce((sum, a) => sum + (a.timeTaken ?? 0), 0);

    const submissions: SubmissionResult[] = attempts
      .sort((a, b) => {
        const aTime = a.submittedAt ?? a.startedAt;
        const bTime = b.submittedAt ?? b.startedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })
      .map((attempt) => ({
        id: attempt.id,
        takerName: attempt.takerName,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt ?? null,
        timeTaken: attempt.timeTaken ?? null,
        score: attempt.score ?? null,
        status: attempt.submittedAt ? ("Completed" as const) : ("Incomplete" as const),
        answers: quiz.questions.map((question, index) => {
          const key = question.id ?? `question-${index}`;
          const selectedIndex = attempt.answers?.[key] ?? null;
          return {
            questionId: key,
            question: question.prompt,
            options: question.options,
            selectedIndex,
            correctIndex: question.correctOptionIndex,
            isCorrect: selectedIndex === question.correctOptionIndex
          };
        })
      }));

    return {
      id: quiz.id!,
      title: quiz.title,
      subject: quiz.subject ?? "",
      status: quiz.status,
      questionCount: quiz.questions.length,
      totalSubmissions: attempts.length,
      completedSubmissions: completed.length,
      averageScorePercent: totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : null,
      totalCorrect,
      totalPossible,
      averageTimeSecs: completed.length > 0 ? Math.round(totalTimeSecs / completed.length) : null,
      submissions
    };
  }

  private buildPerformanceItem(quiz: Quiz, attempts: QuizAttempt[]): QuizPerformanceItem {
    const completed = attempts.filter((a) => a.submittedAt && a.score != null);
    const totalCorrect = completed.reduce((sum, a) => sum + (a.score ?? 0), 0);
    const totalPossible = completed.length * quiz.questions.length;
    const totalTimeSecs = completed.reduce((sum, a) => sum + (a.timeTaken ?? 0), 0);
    const submittedAttempts = attempts.filter((a) => a.submittedAt);
    const lastSubmittedAt =
      submittedAttempts.length > 0
        ? submittedAttempts.sort(
            (a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime()
          )[0].submittedAt!
        : null;

    return {
      id: quiz.id!,
      title: quiz.title,
      subject: quiz.subject ?? "",
      status: quiz.status,
      questionCount: quiz.questions.length,
      totalSubmissions: attempts.length,
      completedSubmissions: completed.length,
      averageScorePercent: totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : null,
      totalCorrect,
      totalPossible,
      averageTimeSecs: completed.length > 0 ? Math.round(totalTimeSecs / completed.length) : null,
      lastSubmittedAt
    };
  }

  private calculateScore(quiz: Quiz, answers: Record<string, number>): number {
    return quiz.questions.reduce((count, question, index) => {
      const key = question.id ?? `question-${index}`;
      return answers[key] === question.correctOptionIndex ? count + 1 : count;
    }, 0);
  }
}
