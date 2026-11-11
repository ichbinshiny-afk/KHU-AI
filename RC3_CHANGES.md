# TRACEY RC.3 — 변경 요약 (Claude API 호환성 · 신규 사용자 · 실험기록 UX)

## 1. 근본 원인
| 문제 | 원인 |
|---|---|
| Claude 400 `temperature is deprecated` | `src/lib/llm.ts` `callJson()` 이 모든 요청에 `temperature: 0.2` 를 보냄. Sonnet 5.5·Haiku 5.5 는 `temperature`·`top_p`·`top_k` 를 받지 않음. 또한 `package.json`(^0.40.0)·lockfile(0.40.1)과 실제 설치본(1.3.0)이 어긋나 있었음 |
| 상태 화면이 정상처럼 보임 | 키 존재 여부 + 호출 횟수만 표시. 400 도 '호출 1회'로 집계되고 성공/유효 결과 구분이 없었음 |
| 신규 사용자에게 PCR 기록 | `seed.ts` `initialState()` 가 시연용 PCR 4건 + 활성 세션 1건을 자동 생성 |
| 수기 입력이 눈에 안 띔 | 음성 UI 아래의 작은 textarea 로만 존재 |

## 2. 수정 파일
**Claude 호출·진단**
- `src/lib/llm.ts` — `temperature` 제거(요청은 model·max_tokens·system·messages 만). 단계별 기록(API 성공 ≠ 유효 결과), `LlmError`, `probeLLM()`(주요·빠른 모델 각각, 재시도 없음), 기능별 메타데이터 헬퍼
- `src/lib/llmDiag.ts` — 오류 분류(400/401/403/404/429/5xx/timeout/network/validation/no_json), 키 마스킹, 호출 집계(기능 vs 연결 확인), 연결 상태 5종, `AiMeta`
- `src/app/api/status/route.ts` — 상태·집계·마지막 연결 확인 결과. POST(로그인 필요)는 실제 호출
- `src/components/SystemStatus.tsx`, `src/app/settings/page.tsx` — 상태 화면(5단계 상태, 모델별 결과, 단계 표시, 개발자용 상세 접기)
- `src/lib/build/plan.ts`, `src/lib/build/rank.ts`, `src/app/api/troubleshoot/route.ts`, `src/app/api/summarize/route.ts`, `src/lib/topics.ts` — 응답에 `ai { provider, model, executionMode, latencyMs, fallbackReason, evidenceCount }` 추가, 실패 시 규칙 기반 + 사유 기록
- `package.json`, `package-lock.json` — `@anthropic-ai/sdk` ^1.3.0

**신규 사용자·튜토리얼**
- `src/lib/seed.ts` — `initialState()` 는 빈 공간. `migrateState()` 가 `separateDemoData()` 호출
- `src/lib/tutorial/demoData.ts`, `src/lib/tutorial/migration.ts` — 예시 데이터(메모리 전용), 원본 그대로인 시연 샘플만 분리하는 멱등 마이그레이션
- `src/lib/store.tsx` — 분리 결과를 서버에 저장하고 사용자에게 안내(서버는 직전 3개 버전 백업)
- `src/lib/experiments.ts`, `src/components/RequireExperiment.tsx`, `src/components/Shell.tsx`, `src/components/Welcome.tsx` — 빈 공간이면 시작 화면(내 실험 / PCR 튜토리얼)
- `src/app/tutorial/page.tsx` — 7단계 튜토리얼(저장 안 함, 완료 상태만 계정별 저장)
- `src/lib/types.ts` — `tutorial`, `demoMigration`, `ai`, 이벤트 `sessionId/experimentId/source:"manual"`

**실험기록**
- `src/components/LabInput.tsx` — [직접 입력][음성 입력] 탭(기본 직접 입력), 큰 저장 버튼, 저장 성공/실패·서버 저장 상태
- `src/app/lab/page.tsx`, `src/lib/labInput.ts` — 공통 저장(`manual`/`voice`), 원문 보존, 파싱 실패 시 원문 메모로 저장, 타임라인에 출처 표시
- `src/lib/parser.ts`, `src/lib/inquiry.ts` — 기본 출처 `manual`(이전 저장본의 `text` 는 manual 로 취급)

**테스트**: `tests/llm-compat.test.ts`, `tests/user-data-and-input.test.ts`, `tests/helpers/legacyState.ts`, `tests/e2e/f-onboarding-lab-status.spec.ts`, 기존 테스트 보정(`flow`, `notes-inquiry`, `phase2-5`, `build.test`, e2e a/c/d/e)

## 3. 검증 결과
- `tsc --noEmit` 오류 0, `vitest` 210 통과 / 11 건너뜀(외부 네트워크가 필요한 live 테스트), `next build` 성공
- 실제 브라우저(Playwright, Chromium) 신규 e2e 6건 + 기존 a/c/d/e 12건 통과
- 정적 점검 테스트는 `temperature` 를 일부러 되돌리면 실패함을 확인

## 4. 한계 (정직한 보고)
- **실제 Claude API 는 호출하지 못했습니다.** 이 환경에 API 키가 없어 모든 Claude 검증은 로컬 모의 서버(`temperature/top_p/top_k` 가 오면 400 을 돌려주는 엄격 모드)로 했습니다. 실제 키로 `설정 → Claude 연결 확인`을 눌러 확인이 필요합니다.
- 린트: 프로젝트에 ESLint 가 설치·설정돼 있지 않아 실행하지 못했습니다.
- `tests/e2e/b-scenarios.spec.ts` 는 외부 학술 API(OpenAlex 등) 접속이 필요해 실행하지 못했습니다(`next build` 는 통과).
- 마이그레이션은 보수적입니다. 사용자가 손댄 샘플이 하나라도 있으면 빈 `PCR #5` 세션도 남깁니다(삭제보다 보존 우선).
