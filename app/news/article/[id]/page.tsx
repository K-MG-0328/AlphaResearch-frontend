"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useInterestArticle } from "@/features/news/application/hooks/useInterestArticle";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id ? Number(params.id) : null;
  const { article, status } = useInterestArticle(articleId);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (status === "error" || !article) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            기사 정보를 불러올 수 없습니다.
          </p>
          <Link
            href="/news/saved"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            저장된 기사 목록으로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          ← 뉴스 목록으로
        </button>

        {/* 기사 카드 */}
        <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

          {/* 제목 */}
          <h1 className="text-xl font-bold leading-snug text-zinc-900 dark:text-zinc-50">
            {article.title}
          </h1>

          {/* 메타 */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            {article.source && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {article.source}
              </span>
            )}
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline dark:text-blue-400"
            >
              원본 기사 바로가기 →
            </a>
            {article.publishedAt && !isNaN(new Date(article.publishedAt).getTime()) && (
              <span>{new Date(article.publishedAt).toLocaleDateString("ko-KR")}</span>
            )}
          </div>

          <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

          {/* 본문 */}
          {article.content ? (
            <p className="whitespace-pre-line text-sm leading-loose text-zinc-700 dark:text-zinc-300">
              {article.content}
            </p>
          ) : (
            <p className="text-sm text-zinc-400">
              본문을 불러올 수 없습니다. 아래 원본 기사에서 확인해 주세요.
            </p>
          )}

          <hr className="my-8 border-zinc-100 dark:border-zinc-800" />

          {/* 액션 */}
          <div className="flex items-center justify-between">
            <Link
              href="/news/saved"
              className="text-sm text-zinc-500 hover:text-zinc-700 hover:underline dark:hover:text-zinc-300"
            >
              저장된 기사 목록
            </Link>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              원본 뉴스 바로가기 →
            </a>
          </div>
        </article>

      </div>
    </div>
  );
}
