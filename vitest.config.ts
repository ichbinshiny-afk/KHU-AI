import { defineConfig } from "vitest/config";
import path from "node:path";
// Playwright E2E(tests/e2e)는 Vitest 대상이 아니다(npm run e2e 로 실행)
export default defineConfig({ test: { environment: "node", exclude: ["node_modules/**", "tests/e2e/**", ".next/**"] }, resolve: { alias: { "@": path.resolve(__dirname, "src") } } });
