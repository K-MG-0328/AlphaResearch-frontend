"use client";

import { useAtomValue } from "jotai";
import { macroAtom } from "@/features/dashboard/application/atoms/macroAtom";
import { useMacroIndicators } from "@/features/dashboard/application/hooks/useMacroIndicators";
import MacroLineChart from "@/features/dashboard/ui/components/MacroLineChart";

export default function MacroPanel() {
  useMacroIndicators();

  const macroState = useAtomValue(macroAtom);

  const isLoading = macroState.status === "LOADING";
  const errorMessage = macroState.status === "ERROR" ? macroState.message : undefined;
  const data = macroState.status === "SUCCESS" ? macroState.data : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MacroLineChart
        title="기준금리"
        unit="%"
        color="#3b82f6"
        data={data?.interestRate ?? null}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      <MacroLineChart
        title="CPI"
        unit="%"
        color="#f59e0b"
        data={data?.cpi ?? null}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      <MacroLineChart
        title="실업률"
        unit="%"
        color="#10b981"
        data={data?.unemployment ?? null}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}
