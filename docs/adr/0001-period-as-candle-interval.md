# ADR-0001 (Frontend Mirror): `period` → `chartInterval` 재해석

## Status

Accepted — 2026-04 (백엔드 ADR-0001 와 동시 채택)

## Context

이 ADR 은 백엔드 ADR-0001 의 프론트엔드 미러. 동일 결정을 frontend 코드에서
어떻게 적용했는지 정리한다.

원문: `AlphaResearch-backend/docs/adr/0001-period-as-candle-interval.md`

대시보드 차트 탭 `1D / 1W / 1M / 1Y` 는 설계상 **봉 단위 (candle interval)**.
그러나 프론트 코드에서 백엔드 query string 으로 `?period=1M` 을 보내면서:

- `period` 라는 단어가 "기간" / "주기" 양쪽 의미로 사용되어 오독 빈도 ↑
- yfinance API 의 `period` (lookback) vs `interval` (봉 단위) 와 충돌
- atom 이름 (`periodAtom`) 만 봐서는 "기간" 인지 "봉" 인지 구분 불가

## Decision

1. **TypeScript 네이밍 통일**
   - 봉 단위 → `chartInterval` 타입 + 변수
     - 값: `"1D" | "1W" | "1M" | "1Q"`
     - `"1Y"` 입력 시 frontend 에서 `"1Q"` 로 normalize (이중 안전망 — 백엔드도
       동일 매핑)
   - 조회 기간 → `lookbackRange`
     - 값: `"1M" | "3M" | "6M" | "1Y" | "5Y" | "10Y"`
   - `period` 라는 이름은 **신규 코드에서 금지**

2. **Atom / Hook 리네이밍**
   - `periodAtom` → `chartIntervalAtom`
   - `usePeriod` → `useChartInterval`

3. **API query string 키**
   - `?period=1M` → `?chartInterval=1M`
   - 백엔드는 `Query(..., alias="chartInterval")` 로 alias 받음

4. **UI 라벨**
   - `1Q` 탭의 표시 레이블은 `"분기"` (yfinance 가 연봉 미지원으로 분기봉 사용)

## Consequences

### 긍정
- 코드 가독성 향상 — 탭 컴포넌트만 봐도 "봉 단위" 의미 즉시 이해
- backend / frontend 명명 일관성으로 풀스택 디버깅 용이
- `period` 다의성 제거로 AI 도우미 / 새 개발자 오독 빈도 ↓

### 주의
- 프론트·백엔드 동시 배포 필요 (또는 별칭 유지 기간 관리)
- 기존 `1Y` 탭 사용자에게 "분기봉" 변경 사실 안내 필요 (UI 툴팁/CTA)

## 구현 위치 (Frontend)

- `features/dashboard/application/atoms/chartIntervalAtom.ts` — atom 정의
- `features/dashboard/ui/components/ChartIntervalTabs.tsx` — 탭 UI (1D/1W/1M/1Q)
- `features/dashboard/infrastructure/api/*.ts` — API 호출 시 `chartInterval` query
- `features/history-agent/...` 의 `lookbackRange` 도 같은 방식으로 통일

## 관련

- Backend ADR: `AlphaResearch-backend/docs/adr/0001-period-as-candle-interval.md`
- Convention guide: [conventions.md](../conventions.md)
- Architecture overview: [architecture.md](../architecture.md)
