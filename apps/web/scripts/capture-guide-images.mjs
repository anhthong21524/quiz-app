import { chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/guide-images");

const BASE = "http://localhost:3000";
const EMAIL = "admin@quiz.app";
const PASSWORD = "admin1234";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

async function shot(name, url, setup) {
  await page.goto(url, { waitUntil: "networkidle" });
  if (setup) await setup(page);
  await page.screenshot({ path: path.join(outDir, `${name}.jpg`), type: "jpeg", quality: 90, fullPage: false });
  console.log(`✓ ${name}.jpg`);
}

// 1. Home page
await shot("home", `${BASE}/`);

// 2. Login page
await shot("login", `${BASE}/login`);

// 3. Public Quizzes
await shot("public-quizzes", `${BASE}/quizzes`);

// 4. Quiz landing page
await shot("quiz-landing", `${BASE}/q/quiz-2-43981d`);

// 5. Quiz taking view
await shot("quiz-take", `${BASE}/q/quiz-2-43981d`, async (p) => {
  await p.fill("input[placeholder*='name']", "Test User");
  await p.click("button:has-text('Start quiz')");
  await p.waitForLoadState("networkidle");
});

// Login for protected pages
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill("input[type='email']", EMAIL);
await page.fill("input[type='password']", PASSWORD);
await page.click("button[type='submit']");
await page.waitForURL(`${BASE}/management`, { timeout: 8000 });

// 6. Management dashboard
await shot("management-dashboard", `${BASE}/management`);

// 7. My Quizzes
await shot("my-quizzes", `${BASE}/management/quizzes`);

// 8. Create Quiz
await shot("create-quiz", `${BASE}/management/create-quiz`);

// 9. Quiz Results
await shot("quiz-results", `${BASE}/management/results`);

await browser.close();
console.log("All screenshots saved to public/guide-images/");
