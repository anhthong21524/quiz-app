import { expect, test } from "@playwright/test";
import {
  adminCredentials,
  apiBaseUrl,
  createQuizFromCreator,
  signInAsAdmin
} from "./helpers";

test("public quizzes navigation loads more results and filters by search", async ({ page }) => {
  const publicQuizzes = [
    {
      id: "science-basics",
      slug: "science-basics",
      title: "Science Basics",
      description: "A short quiz about everyday science.",
      questionCount: 8,
      timeLimit: 10,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "world-capitals",
      slug: "world-capitals",
      title: "World Capitals",
      description: "Practice capital cities from around the world.",
      questionCount: 12,
      timeLimit: 15,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "history-highlights",
      slug: "history-highlights",
      title: "History Highlights",
      description: "Key moments from modern history.",
      questionCount: 10,
      timeLimit: null,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "math-drills",
      slug: "math-drills",
      title: "Math Drills",
      description: "Quick arithmetic and logic practice.",
      questionCount: 6,
      timeLimit: 8,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "language-lab",
      slug: "language-lab",
      title: "Language Lab",
      description: "Vocabulary and grammar warmups.",
      questionCount: 9,
      timeLimit: 12,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "music-theory",
      slug: "music-theory",
      title: "Music Theory",
      description: "Notes, rhythm, and listening basics.",
      questionCount: 7,
      timeLimit: 10,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "space-science",
      slug: "space-science",
      title: "Space Science",
      description: "Planets, stars, and exploration.",
      questionCount: 11,
      timeLimit: 15,
      questionType: "Multiple Choice",
      isPublished: true
    },
    {
      id: "sports-trivia",
      slug: "sports-trivia",
      title: "Sports Trivia",
      description: "Teams, records, and classic moments.",
      questionCount: 10,
      timeLimit: null,
      questionType: "Multiple Choice",
      isPublished: true
    }
  ];

  await page.route("**/api/quizzes/public", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(publicQuizzes)
    });
  });

  await page.goto("/login");
  await page.getByRole("link", { name: "Quizzes" }).click();

  await expect(page).toHaveURL(/\/quizzes$/);
  await expect(page.getByRole("heading", { name: "Choose a quiz to start" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveCount(6);
  await expect(page.getByRole("button", { name: "Load more" })).toBeVisible();

  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);

  await page.getByRole("searchbox", { name: "Search quizzes" }).fill("science");

  await expect(page.getByRole("heading", { name: "Science Basics" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Space Science" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "World Capitals" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Load more" })).toHaveCount(0);
});

test("create account signs the user in", async ({ page }) => {
  const email = `creator-${Date.now()}@quiz.app`;

  await page.goto("/login");

  await page.getByRole("tab", { name: "Create account" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password", exact: true }).fill("Stronger123!");
  await page.getByRole("textbox", { name: "Confirm password" }).fill("Stronger123!");
  await page.getByRole("button", { name: "Create account ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();
  await expect(page).toHaveURL(/\/management\/quizzes$/);
});

test("create and publish a quiz", async ({ page }) => {
  const quizTitle = `Platform onboarding ${Date.now()}`;

  await signInAsAdmin(page);
  await createQuizFromCreator(page, {
    title: quizTitle,
    description: "A quiz for newly onboarded platform engineers.",
    questionPrompt: "Which package manager is configured for this monorepo?",
    optionA: "pnpm",
    optionB: "npm"
  });

  const quizRow = page.getByRole("row").filter({ hasText: quizTitle });
  await expect(quizRow).toBeVisible();
  await quizRow.getByRole("button", { name: `More options for ${quizTitle}` }).click();
  await quizRow.getByRole("menuitem", { name: "Publish" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Publish" }).click();
  await expect(quizRow.getByText("Published")).toBeVisible();

  await quizRow.getByRole("button", { name: `Share ${quizTitle}` }).click();
  await expect(page.locator("input[readonly]")).toHaveValue(/\/q\//);
  await page.getByRole("button", { name: "Done" }).click();
});

test("save quiz from guided creator and reopen it for editing", async ({ page }) => {
  const quizTitle = `Guided creator ${Date.now()}`;
  const quizDescription = "A short guided creator quiz for workspace tooling.";
  const updatedPrompt = "Which package manager is configured for this workspace?";

  await signInAsAdmin(page);
  await createQuizFromCreator(page, {
    title: quizTitle,
    description: quizDescription,
    difficulty: "Medium",
    timeLimitMinutes: 20,
    questionPrompt: "Which package manager does this workspace use?",
    optionA: "pnpm",
    optionB: "npm"
  });

  const quizRow = page.getByRole("row").filter({ hasText: quizTitle });
  await expect(quizRow).toBeVisible();
  await expect(quizRow.getByText("Programming")).toBeVisible();

  await quizRow.getByRole("button", { name: `Edit ${quizTitle}` }).click();
  await expect(page).toHaveURL(/\/management\/quizzes\/.+\/questions$/);
  await expect(page.getByRole("heading", { name: "Edit quiz" })).toBeVisible();

  await page.getByRole("button", { name: "Configuration", exact: true }).click();
  await expect(page.getByLabel("Quiz description")).toHaveValue(quizDescription);
  await expect(page.getByLabel("Time limit minutes")).toHaveValue("20");

  await page.getByRole("button", { name: "Save & continue" }).click();
  await expect(page.getByRole("textbox", { name: "Question" })).toHaveValue(
    "Which package manager does this workspace use?"
  );

  await page.getByRole("textbox", { name: "Question" }).fill(updatedPrompt);
  await page.getByRole("button", { name: "Update quiz" }).click();
  await expect(page).toHaveURL(/\/management\/quizzes$/);

  await quizRow.getByRole("button", { name: `Edit ${quizTitle}` }).click();
  await expect(page.getByRole("textbox", { name: "Question" })).toHaveValue(updatedPrompt);
});

test("quizzes are scoped to the authenticated creator", async ({ request }) => {
  const quizTitle = `Owner scoped ${Date.now()}`;
  const otherEmail = `other-${Date.now()}@quiz.app`;

  const adminLogin = await request.post(`${apiBaseUrl}/auth/login`, {
    data: {
      email: adminCredentials.email,
      password: adminCredentials.password
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
  expect(createdQuiz.ownerEmail).toBe(adminCredentials.email);

  const otherRegister = await request.post(`${apiBaseUrl}/auth/register`, {
    data: {
      email: otherEmail,
      password: "Stronger123!"
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
