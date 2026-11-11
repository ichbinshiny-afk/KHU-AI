# 데이터베이스·저장소·마이그레이션

## 저장 모드
| 모드 | 설정 | 저장 위치 | 용도 |
|---|---|---|---|
| file (기본) | `TRACEY_AUTH_MODE=local` | `.data/app/users.json`(계정, scrypt), `.data/app/users/<uid>/state.json`(+백업 3개, `diagnosis-log.jsonl`), `.data/corpora/<uid>/<exp>.json`·`.job.json`·`.pdfseeds.json` | 단일 서버, 시연, 학교 서버 |
| supabase | `TRACEY_AUTH_MODE=supabase` + `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` | Supabase Auth + Postgres(`app_state`, `corpora`) | 서버리스·다중 인스턴스 |

파일 모드에서도 모든 쓰기는 임시 파일 → rename 으로 원자적으로 하고, 앱 상태는 version 기반 낙관적 동시성을 적용합니다.
**서버리스(Vercel 등)는 파일이 영구적이지 않으므로 supabase 모드를 쓰세요.**

## 마이그레이션
```
supabase/migrations/0001_core.sql                 # app_state(+history 트리거), experiments, corpora, corpus_jobs, diagnosis_logs, RLS
supabase/migrations/0002_citation_exploration.sql # 인용 탐색 확장 설계(pgvector 필요, 앱 미사용)
```
적용: `supabase db push` 또는 SQL Editor 에서 순서대로 실행.

### 검증 상태
- 0001: **로컬 PostgreSQL 16 + Supabase auth 스텁**(`supabase/tests/stub_supabase_auth.sql`)에 적용하고 `supabase/tests/rls_test.sql`로 확인:
  사용자 B 가 A 의 상태·이력·코퍼스를 읽거나 수정하지 못함, 다른 사용자 명의 INSERT 거부, anon 0건, 코퍼스 쓰기는 service_role 만, 갱신 시 이력 백업 생성.
  재현:
  ```bash
  createdb t1 && psql -d t1 -f supabase/tests/stub_supabase_auth.sql -f supabase/migrations/0001_core.sql -f supabase/tests/rls_test.sql
  ```
- 실제 Supabase 프로젝트(GoTrue·PostgREST)와 앱 어댑터의 연동: **미검증**(계정 없음). 스텁은 `request.jwt.claim.sub` 를 쓰며 실제 Supabase 의 `auth.uid()` 와 동작 방식이 같다고 가정.
- 0002: pgvector 가 없는 환경이라 적용하지 않음.

## 기존 데이터 이전
- V3(로그인 이전) 사용자: 로그인 후 서버에 상태가 없으면 브라우저 `tracey.state.v1` 을 자동으로 계정에 이전(화면 알림).
- file → supabase: `.data/app/users/<uid>/state.json` 의 `state` 를 `app_state.state` 로 옮기면 됩니다(사용자 ID 는 Supabase 사용자 UUID 로 재매핑 필요 — 스크립트 미제공).
- 백업: 설정 화면 '백업 내려받기(JSON)' / '백업에서 복원', 서버는 저장 때마다 직전 3개 버전(file) 또는 10개(supabase 트리거) 보관.
