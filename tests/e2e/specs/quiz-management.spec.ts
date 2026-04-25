import { expect, test } from "@playwright/test";

test("create and publish a quiz", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill("admin@quiz.app");
  await page.getByRole("textbox", { name: "Password" }).fill("admin1234");
  await page.getByRole("button", { name: "Sign in ->" }).click();

  await expect(page.getByRole("heading", { name: "Chemistry Basics" })).toBeVisible();

  await page.goto("/editor");

  await page.getByRole("textbox", { name: "Title" }).fill("Platform onboarding");
  await page
    .getByRole("textbox", { name: "Description" })
    .fill("A quiz for newly onboarded platform engineers.");
  await page
    .getByRole("textbox", { name: "Prompt" })
    .fill("Which package manager is configured for this monorepo?");
  await page
    .getByRole("textbox", { name: "Option 1" })
    .fill("pnpm");
  await page
    .getByRole("textbox", { name: "Option 2" })
    .fill("npm");

  await page.getByRole("main").getByRole("button", { name: "Create quiz" }).click();
  await page.getByRole("link", { name: "My Quizzes" }).first().click();

  const quizTable = page.getByRole("table");
  const quizRow = quizTable.getByRole("row").filter({ hasText: "Platform onboarding" });
  await expect(quizRow).toBeVisible();
  await quizRow.getByRole("button", { name: "Publish" }).click();
  await expect(quizRow.getByText("Published")).toBeVisible();
});
