import type { YoutubeFeedResponse } from "@/features/youtube/domain/model/youtubeFeedResponse";
import type { YoutubeListResponse } from "@/features/youtube/domain/model/youtubeListResponse";
import type { YoutubeVideo } from "@/features/youtube/domain/model/youtubeVideo";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient } from "@/infrastructure/http/httpClient";

const PAGE_SIZE = 9;

export interface YoutubeListResult {
  videos: YoutubeVideo[];
  nextPageToken: string | null;
  prevPageToken: string | null;
  totalResults: number;
}

export async function fetchYoutubeList(pageToken?: string): Promise<YoutubeListResult> {
  const params = new URLSearchParams({ max_results: String(PAGE_SIZE) });
  if (pageToken) {
    params.set("page_token", pageToken);
  }

  const { data } = await httpClient<ApiResponse<YoutubeListResponse>>(
    `/api/v1/youtube/list?${params.toString()}`
  );

  const videos: YoutubeVideo[] = data.items.map((item) => ({
    videoId: item.video_id,
    title: item.title,
    thumbnailUrl: item.thumbnail_url,
    channelName: item.channel_name,
    publishedAt: item.published_at,
    videoUrl: item.video_url,
  }));

  return {
    videos,
    nextPageToken: data.next_page_token,
    prevPageToken: data.prev_page_token,
    totalResults: data.total_results,
  };
}

export interface YoutubeFeedResult {
  hasWatchlist: boolean;
  keywords: string[];
  videos: YoutubeVideo[];
  nextPageToken: string | null;
}

export async function fetchYoutubeFeed(pageToken?: string): Promise<YoutubeFeedResult> {
  const params = new URLSearchParams();
  if (pageToken) params.set("page_token", pageToken);

  const { data } = await httpClient<ApiResponse<YoutubeFeedResponse>>(
    `/api/v1/youtube/feed?${params.toString()}`
  );

  const videos: YoutubeVideo[] = data.items.map((item) => ({
    videoId: item.video_id,
    title: item.title,
    thumbnailUrl: item.thumbnail_url,
    channelName: item.channel_name,
    publishedAt: item.published_at,
    videoUrl: item.video_url,
  }));

  return {
    hasWatchlist: data.has_watchlist,
    keywords: data.watchlist_keywords ?? [],
    videos,
    nextPageToken: data.next_page_token,
  };
}
