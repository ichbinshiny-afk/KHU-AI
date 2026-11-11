import { defineConfig } from "@playwright/test";
// 실제 브라우저 E2E. 서버를 먼저 띄운 뒤(BASE_URL) 실행: npx playwright test
export default defineConfig({
  testDir: "tests/e2e", timeout: 240_000, expect: { timeout: 20_000 }, workers: 1, fullyParallel: false, retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/e2e.json" }]],
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3100", locale: "ko-KR", timezoneId: "Asia/Seoul", screenshot: "only-on-failure", trace: "retain-on-failure" },
});
