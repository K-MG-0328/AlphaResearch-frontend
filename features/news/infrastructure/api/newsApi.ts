import type { NewsArticle } from "@/features/news/domain/model/newsArticle";
import type { NewsSearchResponse } from "@/features/news/domain/model/newsSearchResponse";
import type { ApiResponse } from "@/infrastructure/http/apiResponse";
import { httpClient } from "@/infrastructure/http/httpClient";

export interface SaveArticleRequest {
  title: string;
  link: string;
  source?: string;
  published_at?: string;
  snippet?: string;
}

export interface BookmarkArticleResponse {
  article_id: number;
  saved_at: string;
}

// 저장된 기사 목록 조회에 사용되는 타입 (GET /news/saved)
export interface SavedArticleItem {
  article_id: number;
  title: string;
  link: string;
  source?: string;
  published_at?: string;
  snippet?: string;
  content?: string;
  saved_at: string;
}

export interface SavedArticlesResult {
  articles: SavedArticleItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export async function getSavedArticles(page: number, pageSize: number): Promise<SavedArticlesResult> {
  const { data } = await httpClient<ApiResponse<{ articles: SavedArticleItem[]; page: number; page_size: number; total_count: number }>>(
    `/api/v1/news/saved?page=${page}&page_size=${pageSize}`
  );
  return {
    articles: data.articles,
    page: data.page,
    totalPages: Math.max(1, Math.ceil(data.total_count / pageSize)),
    totalCount: data.total_count,
  };
}

/** 인증된 사용자가 저장한 관심 기사를 삭제 (DELETE /api/v1/news/bookmark/{id}) */
export async function deleteBookmark(articleId: number): Promise<void> {
  await httpClient<void>(`/api/v1/news/bookmark/${articleId}`, { method: "DELETE" });
}

/** 인증된 사용자가 관심 기사를 저장 (POST /api/v1/news/bookmark, 사용자+링크 기반 중복 체크) */
export async function saveArticle(req: SaveArticleRequest): Promise<BookmarkArticleResponse> {
  const { data } = await httpClient<ApiResponse<BookmarkArticleResponse>>("/api/v1/news/bookmark", {
    method: "POST",
    body: JSON.stringify(req),
  });
  return data;
}

export interface SaveInterestArticleRequest {
  title: string;
  link: string;
  source?: string;
  published_at?: string;
}

export interface SaveInterestArticleResponse {
  id: number;
  title: string;
  source?: string;
  link: string;
  published_at?: string;
  content: string;
}

/** 저장된 관심 기사 단건 조회 (GET /api/v1/news/interest-articles/{id}) */
export async function getInterestArticle(id: number): Promise<SaveInterestArticleResponse> {
  const { data } = await httpClient<ApiResponse<SaveInterestArticleResponse>>(
    `/api/v1/news/interest-articles/${id}`
  );
  return data;
}

/** 인증된 사용자가 관심 기사를 저장하고 원문 포함 전체 데이터를 반환 (POST /api/v1/news/interest-articles) */
export async function saveInterestArticle(
  req: SaveInterestArticleRequest
): Promise<SaveInterestArticleResponse> {
  const { data } = await httpClient<ApiResponse<SaveInterestArticleResponse>>(
    "/api/v1/news/interest-articles",
    { method: "POST", body: JSON.stringify(req) }
  );
  return data;
}

export interface WatchlistNewsFeedResult {
  has_watchlist: boolean;
  items: Array<{
    title: string;
    description?: string;
    url: string;
    published_at?: string;
    stock_code?: string;
    stock_name?: string;
  }>;
  total: number;
}

export async function getWatchlistNewsFeed(): Promise<WatchlistNewsFeedResult> {
  const { data } = await httpClient<ApiResponse<WatchlistNewsFeedResult>>("/api/v1/news/watchlist-feed");
  return data;
}

export interface NewsSearchResult {
  articles: NewsArticle[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export async function searchNews(keyword: string, page: number, pageSize: number): Promise<NewsSearchResult> {
  const { data } = await httpClient<ApiResponse<NewsSearchResponse>>(
    `/api/v1/news/search?keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=${pageSize}`
  );

  const articles: NewsArticle[] = (data.articles ?? [])
    .filter((item) => item.title)
    .map((item, index) => ({
      newsId: String(index),
      title: item.title,
      content: item.snippet,
      source: item.source,
      url: item.link ?? "",
      publishedAt: item.published_at,
    }));

  const totalPages = Math.max(1, Math.ceil(data.total_count / pageSize));

  return {
    articles,
    page: data.page,
    totalPages,
    totalCount: data.total_count,
  };
}
