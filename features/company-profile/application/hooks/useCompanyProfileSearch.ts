"use client";

import { useState } from "react";

import type { CompanyProfile } from "@/features/company-profile/domain/model/companyProfile";
import { fetchCompanyProfile } from "@/features/company-profile/infrastructure/api/companyProfileApi";
import { HttpError } from "@/infrastructure/http/httpClient";

export type CompanyProfileSearchState = {
  ticker: string;
  setTicker: (value: string) => void;
  profile: CompanyProfile | null;
  loading: boolean;
  error: string | null;
  submit: (e: React.FormEvent) => void;
};

export function useCompanyProfileSearch(): CompanyProfileSearchState {
  const [ticker, setTicker] = useState("");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ticker.trim();
    if (!trimmed) {
      setError("종목코드를 입력하세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const result = await fetchCompanyProfile(trimmed);
      setProfile(result);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 404) {
          setError(`'${trimmed}' 종목을 찾을 수 없습니다.`);
        } else {
          setError(`조회 실패 (HTTP ${err.status})`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { ticker, setTicker, profile, loading, error, submit };
}
