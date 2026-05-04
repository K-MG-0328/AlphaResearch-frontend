import { atom } from "jotai";

import { newsAtom } from "@/features/news/application/atoms/newsAtom";

export const newsArticlesAtom = atom((get) => {
  const state = get(newsAtom);
  return state.status === "SUCCESS" ? state.articles : [];
});

export const newsTotalPagesAtom = atom((get) => {
  const state = get(newsAtom);
  return state.status === "SUCCESS" ? state.totalPages : 0;
});
