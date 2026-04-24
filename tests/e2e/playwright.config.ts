import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "pnpm.cmd --dir ../.. dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: true
  }
});
