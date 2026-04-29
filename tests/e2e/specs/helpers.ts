import { expect, type Page } from "@playwright/test";

export const adminCredentials = {
  email: "admin@quiz.app",
  password: "admin1234"
};

export const apiBaseUrl = "http://127.0.0.1:3101/api";

interface GuidedQuizDraft {
  title: string;
  description: string;
  subject?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  timeLimitMinutes?: number | null;
  questionPrompt: string;
  optionA: string;
  optionB: string;
  correctOption?: "A" | "B";
  explanation?: string;
}

export async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(adminCredentials.email);
  await page.getByRole("textbox", { name: "Password" }).fill(adminCredentials.password);
  await page.getByRole("button", { name: "Sign in ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();
  await expect(page).toHaveURL(/\/management\/quizzes$/);
}

export async function createQuizFromCreator(page: Page, draft: GuidedQuizDraft) {
  await page.goto("/management/create-quiz");

  await expect(page.getByRole("heading", { name: "Create new quiz" })).toBeVisible();
  await page.getByLabel("Quiz title").fill(draft.title);
  await page.getByLabel("Quiz description").fill(draft.description);
  await page.getByLabel("Subject / Domain").selectOption(draft.subject ?? "Programming");
  await page.getByRole("spinbutton").first().fill("1");

  if (draft.difficulty && draft.difficulty !== "Easy") {
    await page.getByRole("button", { name: draft.difficulty }).click();
  }

  if (draft.timeLimitMinutes != null) {
    await page.getByRole("radio", { name: "Set time limit" }).check({ force: true });
    await page.getByRole("spinbutton", { name: /Time limit minutes/ }).fill(
      String(draft.timeLimitMinutes)
    );
  } else {
    await expect(page.getByRole("radio", { name: "Unlimited" })).toBeChecked();
  }

  await page.getByRole("button", { name: "Save & continue" }).click();
  await expect(page).toHaveURL(/\/management\/quizzes\/.+\/questions$/);

  await page.getByRole("textbox", { name: "Question" }).fill(draft.questionPrompt);
  await page.getByPlaceholder("Add option A").fill(draft.optionA);
  await page.getByPlaceholder("Add option B").fill(draft.optionB);

  if (draft.explanation) {
    await page.getByRole("textbox", { name: "Explanation (optional)" }).fill(draft.explanation);
  }

  await page.getByRole("button", { name: draft.correctOption ?? "A", exact: true }).click();
  await page.getByRole("button", { name: "Update quiz" }).click();
  await expect(page).toHaveURL(/\/management\/quizzes$/);
}
