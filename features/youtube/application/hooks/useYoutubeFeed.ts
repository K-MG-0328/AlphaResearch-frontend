"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { fetchYoutubeFeed } from "@/features/youtube/infrastructure/api/youtubeApi";
import type { YoutubeVideo } from "@/features/youtube/domain/model/youtubeVideo";
import { watchlistVersionAtom } from "@/features/watchlist/application/atoms/watchlistVersionAtom";

export function useYoutubeFeed() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [hasWatchlist, setHasWatchlist] = useState<boolean | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchlistVersion = useAtomValue(watchlistVersionAtom);

  useEffect(() => {
    setIsLoading(true);
    setVideos([]);
    setNextPageToken(null);
    setError(null);

    fetchYoutubeFeed()
      .then((result) => {
        setHasWatchlist(result.hasWatchlist);
        setKeywords(result.keywords);
        setVideos(result.videos);
        setNextPageToken(result.nextPageToken);
      })
      .catch(() => setError("YouTube 영상을 불러오는데 실패했습니다. API 한도 초과 또는 네트워크 오류입니다."))
      .finally(() => setIsLoading(false));
  }, [watchlistVersion]);

  async function loadMore() {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const result = await fetchYoutubeFeed(nextPageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setNextPageToken(result.nextPageToken);
    } catch {
      // silently fail — keep existing videos
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    videos,
    keywords,
    hasWatchlist,
    nextPageToken,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
  };
}
