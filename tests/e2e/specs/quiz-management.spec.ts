import { expect, test } from "@playwright/test";

test("create account signs the user in", async ({ page }) => {
  const email = `creator-${Date.now()}@quiz.app`;

  await page.goto("/login");

  await page.getByRole("tab", { name: "Create account" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("admin1234");
  await page.getByRole("button", { name: "Create account ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();
  await expect(page).toHaveURL(/\/management\/quizzes$/);
});

test("create and publish a quiz", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill("admin@quiz.app");
  await page.getByRole("textbox", { name: "Password" }).fill("admin1234");
  await page.getByRole("button", { name: "Sign in ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();
  await expect(page).toHaveURL(/\/management\/quizzes$/);

  await page.goto("/management/editor");

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
  await quizRow.getByRole("button", { name: "More options for Platform onboarding" }).click();
  await quizRow.getByRole("menuitem", { name: "Publish" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Publish" }).click();
  await expect(quizRow.getByText("Published")).toBeVisible();
});

test("save quiz from guided creator", async ({ page }) => {
  const quizTitle = `Guided creator ${Date.now()}`;

  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill("admin@quiz.app");
  await page.getByRole("textbox", { name: "Password" }).fill("admin1234");
  await page.getByRole("button", { name: "Sign in ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();

  await page.goto("/management/create-quiz");
  await page.getByLabel("Quiz title").fill(quizTitle);
  await page.getByLabel("Subject / Domain").selectOption("Programming");
  await page.getByLabel("Number of questions").fill("1");
  await page.getByRole("button", { name: "Medium" }).click();
  await page.getByRole("button", { name: "Create questions" }).click();

  await page.getByLabel("Question").fill("Which package manager does this workspace use?");
  await page.getByPlaceholder("Option A").fill("pnpm");
  await page.getByPlaceholder("Option B").fill("npm");
  await page.getByRole("button", { name: "A", exact: true }).click();
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page).toHaveURL(/\/management\/quizzes$/);
  const quizRow = page.getByRole("row").filter({ hasText: quizTitle });
  await expect(quizRow).toBeVisible();
  await expect(quizRow.getByText("Programming")).toBeVisible();
});

test("quizzes are scoped to the authenticated creator", async ({ request }) => {
  const quizTitle = `Owner scoped ${Date.now()}`;
  const otherEmail = `other-${Date.now()}@quiz.app`;
  const apiBaseUrl = "http://localhost:3001/api";

  const adminLogin = await request.post(`${apiBaseUrl}/auth/login`, {
    data: {
      email: "admin@quiz.app",
      password: "admin1234"
    }
  });
  expect(adminLogin.ok()).toBeTruthy();
  const adminAuth = await adminLogin.json();

  const createResponse = await request.post(`${apiBaseUrl}/quizzes`, {
    headers: {
      Authorization: `Bearer ${adminAuth.accessToken}`
    },
    data: {
      title: quizTitle,
      description: "Owned by the admin user.",
      subject: "Programming",
      difficulty: "Easy",
      questions: [
        {
          prompt: "Which package manager is configured for this monorepo?",
          options: ["pnpm", "npm"],
          correctOptionIndex: 0
        }
      ]
    }
  });
  expect(createResponse.ok()).toBeTruthy();
  const createdQuiz = await createResponse.json();
  expect(createdQuiz.ownerId).toBeTruthy();
  expect(createdQuiz.ownerEmail).toBe("admin@quiz.app");

  const otherRegister = await request.post(`${apiBaseUrl}/auth/register`, {
    data: {
      email: otherEmail,
      password: "admin1234"
    }
  });
  expect(otherRegister.ok()).toBeTruthy();
  const otherAuth = await otherRegister.json();

  const otherListResponse = await request.get(`${apiBaseUrl}/quizzes`, {
    headers: {
      Authorization: `Bearer ${otherAuth.accessToken}`
    }
  });
  expect(otherListResponse.ok()).toBeTruthy();
  const otherQuizzes = await otherListResponse.json();
  expect(otherQuizzes.some((quiz: { id?: string }) => quiz.id === createdQuiz.id)).toBe(false);

  const otherUpdateResponse = await request.patch(`${apiBaseUrl}/quizzes/${createdQuiz.id}`, {
    headers: {
      Authorization: `Bearer ${otherAuth.accessToken}`
    },
    data: {
      title: "Not mine"
    }
  });
  expect(otherUpdateResponse.status()).toBe(404);

  const adminListResponse = await request.get(`${apiBaseUrl}/quizzes`, {
    headers: {
      Authorization: `Bearer ${adminAuth.accessToken}`
    }
  });
  expect(adminListResponse.ok()).toBeTruthy();
  const adminQuizzes = await adminListResponse.json();
  expect(adminQuizzes.some((quiz: { id?: string }) => quiz.id === createdQuiz.id)).toBe(true);

  await request.delete(`${apiBaseUrl}/quizzes/${createdQuiz.id}`, {
    headers: {
      Authorization: `Bearer ${adminAuth.accessToken}`
    }
  });
});
