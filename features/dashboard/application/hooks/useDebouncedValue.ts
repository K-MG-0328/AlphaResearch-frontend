import { useEffect, useState } from "react";

// KR7 슬라이더 — 빠른 슬라이드 중에 매 step 마다 fetch 가 트리거되지 않도록 debounce.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
