# Frontend Conventions

## 네이밍

### 시간 관련 파라미터 (ADR-0001)

- **봉 단위 (candle interval)** → `chartInterval`
  - 값: `"1D" | "1W" | "1M" | "1Q"`
  - 백엔드 API query: `?chartInterval=1M`
  - Jotai atom: `chartIntervalAtom`
- **조회 기간 (lookback duration)** → `lookbackRange`
  - 값: `"1M" | "3M" | "6M" | "1Y" | "5Y" | "10Y"`
  - 백엔드 API query: `?lookbackRange=5Y`
- **`period` 는 신규 코드에서 사용 금지** — 기존 API 가 있어도 새 코드에서 도입 X
- **`1Y` chart_interval 값은 deprecated** — 백엔드에서 자동으로 `1Q` 로 매핑됨

### 파일/심볼

- 컴포넌트: `PascalCase.tsx` (예: `NasdaqChart.tsx`)
- Hook: `useXxx.ts` (예: `useCompanyProfileSearch.ts`)
- atom: `xxxAtom.ts` 또는 `xxxAtom` 변수
- API 함수: `verbResource()` (예: `fetchNasdaqBars`, `saveArticle`)
- 타입: `XxxResponse` (서버 응답), `XxxRequest` (요청 body)

### Path alias

`@/*` → 프로젝트 루트. 예시:
- `@/features/dashboard/...`
- `@/ui/components/...`
- `@/infrastructure/httpClient`

상대 경로 (`../../...`) 보다 path alias 를 우선.

## TypeScript

- **strict mode 필수** (tsconfig 로 강제)
- `any` 금지 — 정 어쩔 수 없으면 `unknown` 사용 후 타입 가드
- type-only import 는 `import type { Foo } from "..."` (ESLint
  `@typescript-eslint/consistent-type-imports` 강제)

## React

- **함수형 컴포넌트만 사용**
- `useEffect` 의존 배열 누락은 lint error (`react-hooks/exhaustive-deps`)
- side effect 는 application hook 안에서만 (UI 컴포넌트 본문 금지)
- props 는 명시적 type — `Props` 인터페이스 export 권장

## Jotai 패턴

```ts
// atoms/chartIntervalAtom.ts
export const chartIntervalAtom = atom<ChartInterval>("1M");

// hooks/useChartInterval.ts
export function useChartInterval() {
  const [value, setValue] = useAtom(chartIntervalAtom);
  return { value, setValue };
}

// ui/components/ChartIntervalTabs.tsx (Dumb)
type Props = { value: ChartInterval; onChange: (v: ChartInterval) => void };
export function ChartIntervalTabs({ value, onChange }: Props) { ... }

// app/dashboard/page.tsx (entry)
const { value, setValue } = useChartInterval();
return <ChartIntervalTabs value={value} onChange={setValue} />;
```

## API 호출

- **모두 `infrastructure/api` 안에서**. UI/atom 에서 직접 fetch 금지
- 전역 `httpClient` 사용 (BASE_URL, 쿠키, 에러 처리 내장)
- 응답 타입은 `domain/` 또는 `application/` 의 타입과 매핑

```ts
// features/dashboard/infrastructure/api/nasdaqApi.ts
export async function fetchNasdaqBars(chartInterval: ChartInterval) {
  return httpClient.get<NasdaqBarsResponse>("/api/v1/dashboard/nasdaq", {
    params: { chartInterval },
  });
}
```

## ESLint 강제 규칙 (error)

- `@typescript-eslint/no-unused-vars` — underscore prefix 만 예외
- `@typescript-eslint/consistent-type-imports` — type-only import 분리
- `react-hooks/exhaustive-deps` — useEffect/useCallback 의존성 누락 금지

## Git 워크플로우

- main 직접 push 금지, 항상 PR
- merge commit 으로 머지 (squash 금지 — 원본 SHA 보존)
- 한 PR = 한 관심사

## 관련

- [Architecture](./architecture.md)
- [ADR-0001](./adr/0001-period-as-candle-interval.md)
