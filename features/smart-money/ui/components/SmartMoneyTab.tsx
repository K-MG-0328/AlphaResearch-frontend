"use client";

import { useState } from "react";

import type { InvestorType } from "@/features/smart-money/domain/model/investorFlowItem";
import InvestorFlowTable from "@/features/smart-money/ui/components/InvestorFlowTable";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

const TABS: { label: string; type: InvestorType }[] = [
  { label: "외국인", type: "FOREIGN" },
  { label: "기관", type: "INSTITUTION" },
  { label: "개인", type: "INDIVIDUAL" },
];

export default function SmartMoneyTab() {
  const [activeType, setActiveType] = useState<InvestorType>("FOREIGN");

  return (
    <div>
      <div className={s.tabs.wrap}>
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveType(tab.type)}
            className={`${s.tabs.btn} ${activeType === tab.type ? s.tabs.active : s.tabs.inactive}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <InvestorFlowTable investorType={activeType} />
    </div>
  );
}
