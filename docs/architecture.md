# AlphaResearch Frontend Architecture

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5 (strict)
- **Style**: Tailwind CSS 4
- **State**: Jotai
- **Lint**: ESLint 9

## Layer 모델 (Feature-based + Clean Architecture)

```
features/<feature>/
  domain/          model, state, intent, value object — 순수 타입
  application/     atoms, selectors, commands, hooks  — 상태 + UseCase
  infrastructure/  api, storage adapter               — 외부 통신
  ui/              components                         — Dumb 컴포넌트

ui/                공통 컴포넌트 (Navbar, primitive)
infrastructure/    httpClient, env config             — 전역
app/               Next.js routing entry              — 페이지만
```

## Layer 의존성

```
        UI ───▶ Application ───▶ Domain
        ▲                          ▲
        │                          │
   app/page                  Infrastructure
```

**허용된 방향만** 의존성을 가질 수 있다. 절대 금지:
- `Domain → Application` / `Domain → UI`
- `Application → UI`
- `Infrastructure → Application` / `Infrastructure → UI`

## Layer 별 MUST 규칙

### Domain
- 순수 TypeScript 타입/모델/값 객체
- 외부 의존성 import 금지: API client, Jotai, React, Next, storage

### Application
- **상태**: Jotai atoms (`application/atoms`)
- **UseCase orchestration**: hooks (`application/hooks`)
- 외부 호출은 항상 infrastructure 를 통해서만 (`features/<x>/infrastructure/api`)

### Infrastructure
- API 호출은 `infrastructure/api` 안에서만 수행
- 전역 `httpClient` 사용 (BASE_URL, 쿠키, 공통 에러 처리 내장)
- 도메인별 API 모듈은 `features/<x>/infrastructure/api/*.ts`

### UI
- **Dumb 컴포넌트 원칙** — 비즈니스 로직 작성 금지, side effect 금지
- props 로 데이터·콜백 받고 JSX 만 반환
- `app/<route>/page.tsx` 는 application hook 호출 + UI 렌더만 담당

## 페이지 → Hook → API 흐름

```
app/dashboard/page.tsx                     ← Next route entry
  └ uses useDashboardChartData()           ← application hook
        └ reads chartIntervalAtom          ← jotai atom
        └ calls fetchNasdaqBars()          ← infrastructure API
              └ httpClient.get(...)        ← global HTTP
```

## 새 기능 추가 절차

1. `features/<name>/domain/` — 도메인 타입 정의 (외부 import 금지)
2. `features/<name>/infrastructure/api/` — API 호출 함수 (httpClient 사용)
3. `features/<name>/application/atoms/` — Jotai 상태 atom
4. `features/<name>/application/hooks/` — UseCase hook (atom + API 조합)
5. `features/<name>/ui/components/` — Dumb 컴포넌트
6. `app/<route>/page.tsx` — entry, hook 호출 + UI 조립

## 백엔드 인터페이스

- 베이스 URL: `NEXT_PUBLIC_API_BASE_URL` (개발: `http://localhost:33333`)
- 인증: 카카오 OAuth → 백엔드 쿠키 발급 → `/api/v1/authentication/me` 로 세션 확인
- 모든 API 응답은 `BaseResponse<T>` 래퍼 (백엔드 공통)

## 관련 ADR

- [ADR-0001: chart_interval / lookback_range 분리](./adr/0001-period-as-candle-interval.md)
