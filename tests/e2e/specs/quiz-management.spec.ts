import { expect, test } from "@playwright/test";

test("create and publish a quiz", async ({ page }) => {
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

  await page.getByRole("button", { name: "Create quiz" }).click();
  await page.getByRole("link", { name: "My Quizzes" }).click();

  await expect(page.getByText("Platform onboarding")).toBeVisible();
  await page.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("published")).toBeVisible();
});

