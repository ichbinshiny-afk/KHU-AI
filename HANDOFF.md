# HANDOFF — TRACEY 1.0.0-rc.3

다음 작업자가 바로 이어받을 수 있도록 '무엇이 어떻게 되어 있고, 무엇이 남았는지'만 적습니다.
상태 표는 [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), 테스트 수치는 [TEST_RESULTS.md](TEST_RESULTS.md).

## 1. 이번 작업(V3 → RC)에서 바뀐 것
| 영역 | V3 | RC |
|---|---|---|
| 진단 | PCR 전용, 비-PCR은 검색 목록만 | 공통 엔진 + 분야 팩 4개(PCR·qPCR / 유기 / 무기 / 일반), 안전 경고·불확실성·질문 1개 |
| 실패 사례 | 검색 화면 전용, eval 이 같은 JSON | 원인 점수에 반영·기록, eval 12개는 `eval/data`로 물리 분리(번들 0건) |
| Claude | 모델 하드코딩, 재순위만 | 모델 env, 타임아웃·로그·연결 확인, 질문 보강, 코퍼스 재순위, 인젝션 완화, 단정 표현 차단(실호출 미검증) |
| 연구주제 | PCR 템플릿·3회 조건·화면 없음 | 범용 규칙/Claude, 요청 시점 문헌 검색, 계획서 10섹션 편집·저장 |
| 연구노트 | 4필드 요약 | 11섹션 초안(기록/AI 구분)·편집·승인 |
| 코퍼스 | 메모리 작업, DOI/제목 Seed | 파일 기반 지속 큐(리스·재시도·재개·크론), PDF Seed, 재순위·선정 이유·로그 |
| 보안 | 클라이언트 owner ID, localStorage | 로그인(로컬 계정/ Supabase 모드), 세션 쿠키, 서버 소유권 검증, 사용자별 서버 저장·버전 충돌·백업, 운영 안전 실패 |
| UI | — | 로그인, 홈 강조 영역+2×2 카드, 연구주제 화면, 분야별 문제해결, 반응형·접근성 수정 |

## 1-0. rc.3 변경 — 실험기록 음성 인식 수정
- 원인·재현·수정 내역: `VOICE_FIX.md`
- `src/lib/speech.ts`(순수 로직), `src/lib/useSpeech.ts`(생명주기 훅), `src/app/lab/page.tsx`(UI), `src/lib/dictionary.ts`(고유어 수)
- 테스트: `tests/speech.test.ts`, `tests/e2e/e-voice.spec.ts`(가짜 인식기 주입 — 실제 Chrome 이벤트 순서 재현)
- 운영은 https 필수(마이크·Secure 쿠키). Chrome 음성 인식은 인터넷 필요.

## 1-1. rc.2 변경(사용자 피드백)
- `src/lib/noteStatus.ts`: 노트 5단계 전이(advance/revert/archive/restoreSnapshot) 순수 함수 + `tests/notes-inquiry.test.ts`
- `src/lib/inquiry.ts`: 실험 주제(InquiryTopic)·궁금증 배정(`inquiryAssign`) 순수 함수
- 상태 필드 추가(하위 호환): `Session.status`(5단계), `statusLog`, `finalApprover`, `publication`, `archived`, `Notebook.snapshots`, `AppState.inquiryTopics`·`inquiryAssign`
- 화면: `src/app/notes/page.tsx`(탭·단계·취소·이력·보관), `src/app/ideas/page.tsx`(주제 폴더), `src/app/lab/page.tsx`(기록 재개)
- 한계: 최종승인은 같은 계정에서 승인자 이름을 기록하는 방식(지도교수 별도 계정·권한 체계는 미구현)

## 2. 코드 지도 (핵심만)
- 진단: `src/lib/engine/diagnose.ts`(점수 = 기본 + 현재 조건 + 답변 + 실패 사례 + 과거 성공 실험 차이) ← `src/lib/domains/*`
- 하위 호환: `src/lib/troubleshoot.ts`(runRules → diagnose), `src/lib/knowledge.ts`(PCR 원 데이터)
- 실험 맥락: `src/lib/context.ts` — 모든 화면이 같은 분야·기본 조건·파라미터를 사용(조건 재입력 방지)
- 클라이언트 상태: `src/lib/store.tsx`(서버 원본 + 사용자별 캐시, 미저장 변경 복구, pagehide flush, 충돌 배너)
- 서버: `src/lib/server/{auth,config,userStore,supabase,rateLimit,diagLog,background}.ts`
- 작업 큐: `src/lib/build/jobs.ts`(파일 `<corpora>/<owner>/<exp>.job.json`), 크론 `GET /api/jobs/tick`(Bearer CRON_SECRET)

## 3. API
| 경로 | 인증 | 설명 |
|---|---|---|
| `POST /api/auth/{signup,login,logout}`, `GET /api/auth/me` | — | 계정·세션(HttpOnly 쿠키) |
| `GET/PUT /api/state` | 필수 | 내 앱 상태(version 낙관적 동시성, 409 충돌) |
| `POST /api/troubleshoot` | 필수 | 진단(domain, symptomId, experiment, corpusId …) |
| `POST/GET/PATCH/DELETE /api/corpus/build` | 필수 | 코퍼스 작업 등록·상태·논문 제외/고정·취소 (owner 는 세션) |
| `GET /api/corpus/search` | 필수 | 내 실험 코퍼스 검색 |
| `POST /api/seed/pdf` | 필수 | Seed PDF(15MB, 원본 비저장) |
| `POST /api/topics`, `POST /api/proposal` | 필수 | 연구주제 후보(서명된 문헌), 계획서 섹션 |
| `POST /api/summarize`, `/api/cite/*` | 필수 | 기존 기능 |
| `GET /api/status`, `POST /api/status` | 공개/필수 | 상태 / Claude 연결 확인 |
| `GET /api/cases`, `/api/corpus`, `POST /api/search` | 공개 | 개발용 사례·PCR 시연 코퍼스(사용자 데이터 없음) |

## 4. 남은 일 (우선순위)
1. **Claude 실호출 검증**: `ANTHROPIC_API_KEY` 설정 → 설정 화면 '연결 확인' → `npm run eval`(M0 자동 포함) → 문제해결에서 'Claude' 모드 문구 확인.
2. **Supabase 실연동**: 프로젝트 생성 → `supabase/migrations/0001_core.sql` 적용 → `TRACEY_AUTH_MODE=supabase` + URL·키 → 가입/저장/코퍼스 저장 확인. (마이그레이션·RLS 는 로컬 PG16 + auth 스텁에서만 검증)
3. **배포**: 서버리스면 파일 저장소가 영구적이지 않음 → supabase 모드 필수, `CRON_SECRET` + 크론으로 `/api/jobs/tick`. 작업 큐를 `corpus_jobs` 테이블로 이전(현재 파일 큐).
4. **블라인드 평가**: 개발에 쓰지 않은 실제 실험 기록으로 신규 사례 수집, 제3자 레이블(EVALUATION.md 한계 참고).
5. 개선 여지: 인용 문장 선택의 관련성(현재 키워드), 진단 중 자동 추가 문헌 검색, 임베딩 기반 의미 검색, OCR, 속도 제한의 공유 저장소화, 인용 탐색 결과의 서버 저장.

## 5. 이 세션의 환경 메모
- 초기에는 npm 레지스트리가 막혀 `tools/offline-qa/`(Vitest·next/server·SDK shim)를 만들었음. 레지스트리가 열린 뒤에는 실제 `npm ci`·Vitest·`next build`·Playwright로 검증. 정상 환경에서는 offline-qa 불필요(최신 코드와 동기화 보장 안 함).
- 샌드박스에서 Node 서버의 `fetch` 가 프록시를 쓰려면 `NODE_USE_ENV_PROXY=1` 필요(일반 서버는 불필요).
- OpenAlex 는 키 없이 공용 IP 일일 예산을 써서 429 가 자주 발생 → `OPENALEX_API_KEY` 권장.
- 시연용 PCR 기록 4건(9/17~10/15)은 샘플이며 UI 에 표시됨.
