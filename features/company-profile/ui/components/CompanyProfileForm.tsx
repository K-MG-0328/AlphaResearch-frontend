"use client";

import { useCompanyProfileSearch } from "@/features/company-profile/application/hooks/useCompanyProfileSearch";
import CompanyProfileCard from "@/features/company-profile/ui/components/CompanyProfileCard";

export default function CompanyProfileForm() {
  const { ticker, setTicker, profile, loading, error, submit } = useCompanyProfileSearch();

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="국내: 6자리 코드(예: 005930) · 미국: 티커(예: AAPL)"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </form>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {profile && <CompanyProfileCard profile={profile} />}

      {!profile && !error && !loading && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          종목코드를 입력하면 회사 정보를 조회합니다. 국내 종목은 DART 기업개황, 미국 종목은 SEC + AI 요약 기반.
        </div>
      )}
    </div>
  );
}
