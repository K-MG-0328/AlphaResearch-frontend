"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";

import { authAtom } from "@/features/auth/application/atoms/authAtom";
import { newsAtom } from "@/features/news/application/atoms/newsAtom";
import type { NewsArticle } from "@/features/news/domain/model/newsArticle";
import { getWatchlistNewsFeed } from "@/features/news/infrastructure/api/newsApi";

export function useNewsList() {
  const [newsState, setNewsState] = useAtom(newsAtom);
  const [authState] = useAtom(authAtom);

  useEffect(() => {
    if (authState.status === "LOADING") return;
    if (authState.status !== "AUTHENTICATED") {
      setNewsState({ status: "UNAUTHENTICATED" });
      return;
    }

    setNewsState({ status: "LOADING" });

    getWatchlistNewsFeed()
      .then((feed) => {
        const articles: NewsArticle[] = feed.items.map((item, index) => ({
          newsId: `feed-${index}`,
          title: item.title,
          content: item.description ?? "",
          source: item.stock_name ?? "",
          url: item.url,
          publishedAt: item.published_at ?? "",
          stockName: item.stock_name ?? undefined,
        }));
        setNewsState({
          status: "SUCCESS",
          articles,
          page: 1,
          totalPages: 1,
          totalCount: articles.length,
          isWatchlistFeed: feed.has_watchlist,
        });
      })
      .catch(() => {
        setNewsState({ status: "ERROR", message: "뉴스를 불러오는데 실패했습니다." });
      });
  }, [authState.status, setNewsState]);

  return { newsState, page: 1, goToPage: (targetPage: number) => void targetPage };
}
