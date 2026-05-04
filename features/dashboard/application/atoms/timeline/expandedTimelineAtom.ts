import { atom } from "jotai";

// 카드별 펼침 상태. idx 단위로 관리하여 LazyTimelineEventCard remount나 스크롤 후에도 보존된다.
export const expandedTimelineEventsAtom = atom<Set<number>>(new Set<number>());

export const toggleExpandedTimelineEventAtom = atom(
  null,
  (get, set, idx: number) => {
    const current = get(expandedTimelineEventsAtom);
    const next = new Set(current);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    set(expandedTimelineEventsAtom, next);
  },
);

// chartInterval 변경 등 타임라인 자체가 바뀌는 시점에 호출하여 초기화한다.
export const resetExpandedTimelineEventsAtom = atom(
  null,
  (_get, set) => {
    set(expandedTimelineEventsAtom, new Set<number>());
  },
);
