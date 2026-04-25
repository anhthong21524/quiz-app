import { expect, test } from "@playwright/test";

test("public Quizzes navigation shows public quizzes", async ({ page }) => {
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
  await expect(page.getByRole("textbox", { name: "Email" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveCount(6);
  await expect(page.getByText("Showing 6 of 8")).toBeVisible();
  await expect(page.getByText("Published")).toBeHidden();
  await expect(page.getByText("Type")).toBeHidden();

  await page.getByRole("searchbox", { name: "Search quizzes" }).fill("science");

  await expect(page.getByRole("heading", { name: "Science Basics" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Space Science" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "World Capitals" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Start quiz" })).toHaveCount(2);
  await expect(page.getByText("2 matches")).toBeVisible();
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
  const quizDescription = "A short guided creator quiz for workspace tooling.";

  await page.goto("/login");

  await page.getByRole("textbox", { name: "Email" }).fill("admin@quiz.app");
  await page.getByRole("textbox", { name: "Password" }).fill("admin1234");
  await page.getByRole("button", { name: "Sign in ->" }).click();

  await expect(page.getByRole("button", { name: "Open account menu" })).toBeVisible();

  await page.goto("/management/create-quiz");
  await page.getByLabel("Quiz title").fill(quizTitle);
  await page.getByLabel("Quiz description").fill(quizDescription);
  await page.getByLabel("Subject / Domain").selectOption("Programming");
  await page.getByLabel("Number of questions").fill("1");
  await page.getByRole("button", { name: "Medium" }).click();
  await expect(page.getByLabel("Unlimited (no time limit)")).toBeChecked();
  await page.getByLabel("Set time limit").check();
  await page.getByLabel("Time limit minutes").fill("20");
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

  await quizRow.getByRole("button", { name: `Edit ${quizTitle}` }).click();
  await expect(page).toHaveURL(/\/management\/quizzes\/.+\/questions$/);
  await expect(page.getByRole("heading", { name: "Edit quiz" })).toBeVisible();
  await page.getByRole("button", { name: "Configuration" }).click();
  await expect(page.getByLabel("Quiz description")).toHaveValue(quizDescription);
  await expect(page.getByLabel("Time limit minutes")).toHaveValue("20");
  await page.getByRole("button", { name: "Update questions" }).click();
  await expect(page.getByRole("textbox", { name: "Question" })).toHaveValue(
    "Which package manager does this workspace use?"
  );

  await page
    .getByRole("textbox", { name: "Question" })
    .fill("Which package manager is configured for this workspace?");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page).toHaveURL(/\/management\/quizzes$/);
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
