"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authAtom } from "@/features/auth/application/atoms/authAtom";
import { savedInterestArticleAtom } from "@/features/news/application/atoms/savedInterestArticleAtom";
import { newsCommand } from "@/features/news/application/commands/newsCommand";
import { useNewsList } from "@/features/news/application/hooks/useNewsList";
import type { NewsArticle } from "@/features/news/domain/model/newsArticle";
import type { SavedInterestArticle } from "@/features/news/domain/model/savedInterestArticle";
import { getSavedArticles } from "@/features/news/infrastructure/api/newsApi";
import { newsListStyles as s } from "@/features/news/ui/components/newsListStyles";
import { HttpError } from "@/infrastructure/http/httpClient";

function SaveButton({
  article,
  initialSavedId,
}: {
  article: NewsArticle;
  initialSavedId?: number;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "duplicate">(
    initialSavedId !== undefined ? "saved" : "idle"
  );
  const [savedId, setSavedId] = useState<number | null>(initialSavedId ?? null);
  const setSavedArticle = useSetAtom(savedInterestArticleAtom);
  const authState = useAtomValue(authAtom);
  const router = useRouter();

  if (!article.url) return null;

  async function handleSave() {
    if (authState.status !== "AUTHENTICATED") {
      setSavedArticle({ status: "UNAUTHENTICATED" });
      router.push("/login");
      return;
    }

    setStatus("saving");
    setSavedArticle({ status: "SAVING" });

    try {
      const result = await newsCommand.SAVE_INTEREST_ARTICLE({
        type: "SAVE_INTEREST_ARTICLE",
        title: article.title,
        link: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
      });

      const saved: SavedInterestArticle = {
        id: result.id,
        title: result.title,
        source: result.source,
        link: result.link,
        publishedAt: result.published_at,
        content: result.content,
      };
      setSavedArticle({ status: "SUCCESS", article: saved });
      setStatus("saved");
      setSavedId(result.id);
      router.push(`/news/article/${result.id}`);
    } catch (e: unknown) {
      if (e instanceof HttpError && e.status === 409) {
        try {
          const result = await getSavedArticles(1, 100);
          const match = result.articles.find((a) => a.link === article.url);
          if (match) {
            const saved: SavedInterestArticle = {
              id: match.article_id,
              title: match.title,
              source: match.source,
              link: match.link,
              publishedAt: match.published_at,
              content: match.snippet ?? "",
            };
            setSavedArticle({ status: "SUCCESS", article: saved });
            setStatus("saved");
            setSavedId(match.article_id);
            router.push(`/news/article/${match.article_id}`);
          } else {
            setStatus("duplicate");
            setSavedArticle({ status: "DUPLICATE" });
          }
        } catch {
          setStatus("duplicate");
          setSavedArticle({ status: "DUPLICATE" });
        }
      } else if (e instanceof HttpError && e.status === 401) {
        setSavedArticle({ status: "UNAUTHENTICATED" });
        router.push("/login");
      } else {
        setStatus("idle");
        setSavedArticle({ status: "ERROR", message: e instanceof Error ? e.message : "저장 실패" });
      }
    }
  }

  if (status === "saved" && savedId !== null) {
    return (
      <button
        className={s.item.savedBadge}
        onClick={() => router.push(`/news/article/${savedId}`)}
      >
        저장됨 · 보기
      </button>
    );
  }
  if (status === "duplicate") {
    return <span className={s.item.savedBadge}>이미 저장된 기사</span>;
  }

  return (
    <button
      className={s.item.saveButton}
      onClick={handleSave}
      disabled={status === "saving"}
    >
      {status === "saving" ? "저장 중..." : "저장하기"}
    </button>
  );
}

export default function NewsList() {
  const { newsState, page, goToPage } = useNewsList();
  const authState = useAtomValue(authAtom);
  const [savedMap, setSavedMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (authState.status !== "AUTHENTICATED") return;
    getSavedArticles(1, 100)
      .then((result) => {
        const map = new Map<string, number>();
        result.articles.forEach((a) => map.set(a.link, a.article_id));
        setSavedMap(map);
      })
      .catch(() => {/* 조용히 실패 */});
  }, [authState.status]);

  if (newsState.status === "LOADING") {
    return (
      <div className={s.card}>
        <p className={s.loading}>뉴스를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (newsState.status === "UNAUTHENTICATED") {
    return (
      <div className={s.card}>
        <p className={s.error}>로그인이 필요한 서비스입니다.</p>
      </div>
    );
  }

  if (newsState.status === "ERROR") {
    return (
      <div className={s.card}>
        <p className={s.error}>{newsState.message}</p>
      </div>
    );
  }

  const { articles, totalPages, isWatchlistFeed } = newsState;

  if (articles.length === 0) {
    return (
      <div className={s.card}>
        <p className={s.empty}>
          {isWatchlistFeed
            ? "관심종목에 대한 뉴스가 아직 수집되지 않았습니다."
            : "표시할 뉴스가 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className={s.card}>
      {isWatchlistFeed && (
        <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
          관심종목 기반 뉴스 {articles.length}건
        </p>
      )}
      <ul className={s.list}>
        {articles.map((article) => (
          <li key={article.newsId} className={s.item.wrap}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                {article.stockName && (
                  <span className="w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {article.stockName}
                  </span>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.item.title}
                >
                  {article.title}
                </a>
              </div>
              <SaveButton
                article={article}
                initialSavedId={savedMap.get(article.url)}
              />
            </div>
            <div className={s.item.meta}>
              {!article.stockName && (
                <span className={s.item.source}>{article.source}</span>
              )}
              {!isNaN(new Date(article.publishedAt).getTime()) && (
                <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>
              )}
            </div>
            {article.content && <p className={s.item.content}>{article.content}</p>}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className={s.pagination.wrap}>
          <button
            className={s.pagination.button}
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
            p === page ? (
              <span key={p} className={s.pagination.active}>
                {p}
              </span>
            ) : (
              <button
                key={p}
                className={s.pagination.button}
                onClick={() => goToPage(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className={s.pagination.button}
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
