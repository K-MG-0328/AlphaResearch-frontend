# AlphaResearch — Frontend

> 한국·미국 주식을 동시에 다루는 개인 투자 정보 플랫폼의 프런트엔드. Next.js 16 (App Router) + React 19 + Jotai + Tailwind CSS 4 기반.

> ⚠️ **Status**: 이 프로젝트는 **로컬 개발 환경 전용** 입니다. 운영 서버는 배포되어 있지 않으며, 본 README 의 가이드는 로컬 머신 기준입니다.

[Backend Repo](https://github.com/K-MG-0328/AlphaResearch-backend) · [내부 가이드 (CLAUDE.md)](./CLAUDE.md)

---

## 페이지 / 기능

| 라우트 | 설명 |
|---|---|
| `/` | 랜딩 — AI 에이전트 진입 |
| `/dashboard` | 종목 대시보드 — OHLCV 차트, 지표, 자산 프로필, 매크로 패널 |
| `/stock-recommendation` | 멀티 시그널 기반 투자 추천 |
| `/smart-money` | 외인·기관 수급, 스마트머니 흐름 |
| `/account` | 계정 / 관심종목 |
| `/login`, `/auth-callback` | Kakao OAuth 로그인 / 콜백 |
| `/settings`, `/terms` | 사용자 설정 / 약관 |

## Feature 모듈

[`features/`](./features) 디렉토리에 도메인별로 격리:

```
auth · company-profile · dashboard · sentiment · smart-money · stock-recommendation · watchlist
```

각 feature 는 4 레이어 (Domain / Application / Infrastructure / UI) 로 분리되어 있습니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router) · React 19 · TypeScript 5 (strict)
- **상태**: [Jotai](https://jotai.org) atoms (전역 상태)
- **스타일**: Tailwind CSS 4 (`@tailwindcss/postcss`)
- **차트**: lightweight-charts (캔들/지표) · Recharts (지표 패널)
- **린트**: ESLint 9 + `eslint-config-next` + `eslint-plugin-import`

## 아키텍처

4-레이어 단방향 의존성. **Domain ← Application ← UI**, **Infrastructure** 는 Domain 만 참조.

```
features/<feature>/
├ domain/            # 모델 · 상태 타입 · intent (순수 타입, 외부 의존성 0)
├ application/       # atoms, selectors, commands, hooks (UseCase orchestration)
├ infrastructure/    # api/ — 외부 통신 (httpClient 사용)
└ ui/                # Dumb Components (비즈니스 로직 / Side effect 금지)

ui/                  # 공통 컴포넌트 (Navbar 등)
infrastructure/      # 전역 httpClient · env · agentHttpClient
app/                 # Next.js 라우팅 — Application Hook 호출만 담당
```

레이어별 규칙:
- **Domain**: API/Storage/프레임워크 import 금지
- **Application**: 외부 호출은 Infrastructure 경유
- **Infrastructure**: API 호출은 `infrastructure/api` 에서만
- **UI**: 비즈니스 로직 / Side effect 금지

자세한 내용: [`CLAUDE.md`](./CLAUDE.md)

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

```bash
cp .env.example .env.local
```

기본값(localhost) 그대로 사용 가능 — backend 가 `:33333` 에서 떠있으면 됩니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:33333
NEXT_PUBLIC_AGENT_API_BASE_URL=http://localhost:33333
NEXT_PUBLIC_KAKAO_LOGIN_PATH=/api/v1/auth/kakao/request-oauth-link
```

> 모든 환경 변수가 `NEXT_PUBLIC_*` prefix — 클라이언트 번들에 포함되는 의도된 공개 값.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인. backend 가 떠있어야 인증·데이터 호출이 동작합니다.

### 4. 그 외 명령어

```bash
npm run build       # production build
npm run start       # built app 실행
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

## Backend 의존성

이 프런트엔드는 [AlphaResearch-backend](https://github.com/K-MG-0328/AlphaResearch-backend) FastAPI 서버에 의존합니다. Backend 를 먼저 띄운 상태로 사용해야 합니다.

```bash
# backend repo 에서
docker compose up -d postgres redis
alembic upgrade head
python main.py        # :33333
```

## Path Alias

`tsconfig.json` 에 `@/*` → 프로젝트 루트 매핑.

```ts
import { useAuth } from "@/features/auth/application/hooks/useAuth";
import { Navbar } from "@/ui/Navbar";
```

## Git 워크플로우

- `main` 직접 푸시 금지. 작업 브랜치 → PR → **merge commit** 으로 머지 (squash 금지)
- 한 PR = 한 관심사
- 자세한 가이드: [`CLAUDE.md`](./CLAUDE.md)

## Documentation

- [`CLAUDE.md`](./CLAUDE.md) — 레이어 규칙, Path Alias, Working Guidelines
- [`docs/`](./docs/) — UX·feature 설계 문서

## License

Personal project. 별도 라이선스 명시 없음 — 코드 사용 전 작성자에게 문의 바랍니다.
