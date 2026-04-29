import { defineConfig } from "@playwright/test";

const webUrl = "http://127.0.0.1:3100";
const apiUrl = "http://127.0.0.1:3101";

export default defineConfig({
  testDir: "./specs",
  timeout: 60_000,
  workers: 1,
  use: {
    baseURL: webUrl,
    trace: "on-first-retry"
  },
  webServer: [
    {
      command:
        `cmd /c "set PORT=3101&& ` +
        `set FRONTEND_URL=${webUrl}&& ` +
        `pnpm.cmd --dir ../.. --filter @quiz-app/api dev"`,
      url: `${apiUrl}/api/auth/google/status`,
      timeout: 120_000,
      reuseExistingServer: true
    },
    {
      command:
        `cmd /c "set VITE_API_BASE_URL=${apiUrl}/api&& ` +
        `set VITE_SITE_URL=${webUrl}&& ` +
        `pnpm.cmd --dir ../.. --filter @quiz-app/web exec vite --host 127.0.0.1 --port 3100 --strictPort"`,
      url: webUrl,
      timeout: 120_000,
      reuseExistingServer: true
    }
  ]
});
