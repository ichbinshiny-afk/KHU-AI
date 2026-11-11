# TRACEY — 선행연구 기반 Interactive Troubleshooting 연구 코파일럿 (Release Candidate)

학부연구생·초기 대학원생이 실험 중 마주친 문제를 **선행연구 + 실패 사례 + 내 실험 기록**으로 좁혀 가고,
기록을 **연구노트**로, 반복된 궁금증을 **연구주제·연구계획서**로 발전시키도록 돕는 웹 앱입니다.
https://tracey-khu-ai.netlify.app/
> 구현·검증 상태는 [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), 테스트 결과는 [TEST_RESULTS.md](TEST_RESULTS.md),
> 평가는 [EVALUATION.md](EVALUATION.md), 시연 순서는 [DEMO_SCENARIO.md](DEMO_SCENARIO.md), 인수인계는 [HANDOFF.md](HANDOFF.md)를 보세요.

## 핵심 흐름
1. **실험 등록** (이름만으로 가능) → 분야 자동 추정(PCR·qPCR / 유기합성 / 무기합성 / 일반) → 선택적으로 핵심 논문(DOI·URL·제목·**PDF**)
2. **자동 코퍼스 구축**(서버 작업 큐): 검색 계획(Claude 또는 규칙) → OpenAlex·Europe PMC 주제 검색 → Seed 인용·피인용 확장 → 중복 제거 → 키워드 1단계 + 실험 프로필 유사도·측면 일치 재순위(+선택: Claude 재순위) → CC 라이선스 원문/초록 색인
3. **실험기록**: 말하거나 입력 → 분야별 조건(온도·당량·pH·용매 등) 자동 구조화, 현재 조건 표(항목/현재 값/단위)
4. **문제해결**: 문제 유형 → 현상 → 원인 후보 최대 3개 + 확인 질문 1개(2~4개 선택지) → 답할수록 순위 갱신 → 확인 방법 → 결과 기록. 문헌 근거·유사 실패 사례·과거 실험 비교는 펼쳐보기. 위험 시약·고압 장비는 안전 경고를 원인보다 먼저 표시
5. **연구노트**: 실험 종료 시 11개 섹션 초안(실제 기록 / AI 해석 구분) → 편집 → 승인 → 최종승인 → 논문 등재. 단계별 탭 분류, 어느 단계든 **취소**로 한 단계씩 되돌림(사유·이력·승인본 복원), 잘못 만든 노트 보관·복원
6. **궁금증 → 연구주제 → 연구계획서**: **실험 주제(폴더)**를 만들고 그 안에 궁금증을 담음(옮기기·숨기기) → 주제별 선행연구 검색(코퍼스 + 요청 시점 검색) → 후보 2~3개(연구 공백 원문 인용·신규성 점검) → 10개 섹션 계획서 편집·저장

## 빠른 시작
```bash
npm ci
cp .env.example .env.local      # 개발 모드는 비밀값 없이도 동작(개발용 기본값 사용)
npm run dev                     # http://localhost:3000 → 계정 만들기
```
운영 빌드:
```bash
export TRACEY_SESSION_SECRET=$(openssl rand -hex 32) TRACEY_SIGNING_SECRET=$(openssl rand -hex 32)
npm run build && npm start      # 비밀값이 없으면 API 가 503 으로 거부(안전한 실패)
```

## 테스트
```bash
npm test                        # Vitest 단위·통합(네트워크 불필요)
npm run typecheck
LIVE=1 npm test                 # 실제 OpenAlex·Europe PMC 호출 포함(OPENALEX_API_KEY 권장)
npm run e2e                     # Playwright: 서버(BASE_URL, 기본 :3100)를 먼저 띄운 뒤 실행
npm run eval                    # 평가용 12개 사례 자동 평가 → EVALUATION_RESULTS.md
```

## 환경변수 요약 (전체는 `.env.example`)
| 변수 | 필수 | 없을 때 |
|---|---|---|
| `TRACEY_SESSION_SECRET`, `TRACEY_SIGNING_SECRET` | 운영 필수 | 운영: 503 / 개발: 개발용 기본값 |
| `TRACEY_AUTH_MODE` | 선택 | `local`(서버 파일 계정·저장) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | supabase 모드 | 503 |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | 선택 | 규칙 기반 모드(화면에 명시) |
| `OPENALEX_API_KEY` | 권장 | 공용 IP 일일 한도(429 가능) |
| `CRON_SECRET` | 서버리스 권장 | 크론 tick 비활성 |

## 구조
```
src/lib/domains/      분야 팩(PCR·qPCR / 유기 / 무기 / 일반): 증상·원인·질문·조건 파라미터·안전 규칙
src/lib/engine/       범용 진단 엔진(diagnose.ts)·문헌 근거 추출(evidence.ts)
src/lib/llm.ts        Claude 계층: 재순위·설명·질문 보강, 인용 원문 대조, 프롬프트 인젝션 완화, 단정 표현 차단
src/lib/cases/        실패 사례 지식 기반(개발용 30개만). 평가용 12개는 eval/data 로 물리 분리
src/lib/build/        코퍼스 구축(build.ts)·재순위(rank.ts)·지속 작업 큐(jobs.ts)·저장소(store.ts)
src/lib/server/       인증(auth.ts)·설정(config.ts)·사용자 상태 저장(userStore.ts)·Supabase REST·속도 제한
src/lib/topics.ts     연구주제 후보·연구계획서 / src/lib/notebook.ts 연구노트 초안 / src/lib/pdfSeed.ts PDF Seed
supabase/migrations/  0001_core(앱 테이블+RLS), 0002_citation_exploration(확장 설계)
eval/                 평가 데이터·정답 레이블·평가 스크립트 / tests/ 통합 테스트 / tests/e2e Playwright
tools/offline-qa/     npm 레지스트리 차단 환경용 대체 테스트 러너(정상 환경에서는 불필요)
```
