import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const artifactsDir = path.resolve(process.cwd(), "test-results", "artifacts");

async function saveEvidence(page: Page, name: string) {
  fs.mkdirSync(artifactsDir, { recursive: true });
  await page.screenshot({
    path: path.join(artifactsDir, name),
    fullPage: true
  });
}

test("creator can review participant answers after a public submission", async ({ page, context }) => {
  const stamp = Date.now();
  const creatorEmail = `creator-e2e-${stamp}@quiz.app`;
  const creatorPassword = "Stronger123!";
  const participantName = "Localization Participant";
  const quizTitle = `Localization E2E ${stamp}`;

  await page.goto("/login");

  await page.getByRole("combobox", { name: "Language" }).selectOption("vi");
  await expect(page.getByRole("heading", { name: "Đăng nhập vào Quiz App" })).toBeVisible();
  await saveEvidence(page, "auto-01-login-vi.png");

  await page.getByRole("combobox").first().selectOption("en");
  await expect(page.getByRole("heading", { name: "Sign in to Quiz App" })).toBeVisible();

  await page.getByRole("tab", { name: "Create account" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(creatorEmail);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill(creatorPassword);
  await page.getByRole("textbox", { name: "Confirm password", exact: true }).fill(creatorPassword);
  await page.getByRole("button", { name: "Create account ->" }).click();

  await expect(page).toHaveURL(/\/management\/quizzes$/);
  await saveEvidence(page, "auto-02-creator-account-created.png");

  await page.goto("/management/create-quiz");
  await expect(page.getByRole("heading", { name: "Create new quiz" })).toBeVisible();
  await page.getByLabel("Quiz title").fill(quizTitle);
  await page.getByLabel("Quiz description").fill(
    "Automated coverage for localization plus creator review flow."
  );
  await page.getByLabel("Subject / Domain").selectOption("Programming");
  await page.getByRole("button", { name: "Save & continue" }).click();

  await expect(page).toHaveURL(/\/management\/quizzes\/.+\/questions$/);
  const quizIdMatch = page.url().match(/\/management\/quizzes\/([^/]+)\/questions$/);
  expect(quizIdMatch).not.toBeNull();
  const quizId = quizIdMatch?.[1] ?? "";

  await saveEvidence(page, "auto-03-question-builder.png");

  await page.getByRole("textbox", { name: "Question" }).fill(
    "Which language code switches the interface to Vietnamese?"
  );
  await page.getByPlaceholder("Add option A").fill("vi");
  await page.getByPlaceholder("Add option B").fill("en");
  await page.getByRole("textbox", { name: "Explanation (optional)" }).fill(
    "The locale selector uses vi for Vietnamese and en for English."
  );
  await page.getByRole("button", { name: "A", exact: true }).click();
  await page.getByRole("button", { name: "Update quiz" }).click();

  await expect(page).toHaveURL(/\/management\/quizzes$/);
  const quizRow = page.getByRole("row").filter({ hasText: quizTitle });
  await expect(quizRow).toBeVisible();

  await quizRow.getByRole("button", { name: `More options for ${quizTitle}` }).click();
  await page.getByRole("menuitem", { name: "Publish" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Publish" }).click();
  await expect(quizRow.getByText("Published")).toBeVisible();
  await saveEvidence(page, "auto-04-quiz-published.png");

  await quizRow.getByRole("button", { name: `Share ${quizTitle}` }).click();
  const shareUrl = await page.locator("input[readonly]").inputValue();
  await page.getByRole("button", { name: "Done" }).click();

  const participantPage = await context.newPage();
  await participantPage.goto(shareUrl);
  await participantPage.getByRole("textbox", { name: "Your name" }).fill(participantName);
  await participantPage.getByRole("button", { name: "Start quiz" }).click();
  await expect(participantPage).toHaveURL(/\/take$/);
  await saveEvidence(participantPage, "auto-05-quiz-taking.png");

  await participantPage.getByRole("radio", { name: "Option A: vi" }).click();
  await participantPage.getByRole("button", { name: "Submit quiz" }).click();
  await expect(participantPage.getByRole("heading", { name: "Submit quiz" })).toBeVisible();
  await expect(
    participantPage.getByText(`${participantName}, your answers have been submitted successfully.`)
  ).toBeVisible();
  await saveEvidence(participantPage, "auto-06-participant-results.png");

  await page.goto(`/management/quizzes/results/${quizId}`);
  await expect(page.getByText(quizTitle)).toBeVisible();
  await expect(
    page.getByRole("button", { name: `Submission detail: ${participantName}` })
  ).toBeVisible();
  await page.getByRole("button", { name: `Submission detail: ${participantName}` }).click();

  await expect(page.getByRole("heading", { name: "Answers review" })).toBeVisible();
  await expect(page.getByText("Your correct answer")).toBeVisible();
  await saveEvidence(page, "auto-07-creator-answer-review.png");
});
