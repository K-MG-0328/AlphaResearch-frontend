import ConcentratedBuyingSection from "@/features/smart-money/ui/components/ConcentratedBuyingSection";
import SmartMoneyTab from "@/features/smart-money/ui/components/SmartMoneyTab";
import SmartMoneyBootstrap from "@/features/smart-money/ui/components/SmartMoneyBootstrap";
import { smartMoneyStyles as s } from "@/features/smart-money/ui/components/smartMoneyStyles";

export default function SmartMoneyPage() {
  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.header.wrap}>
          <h1 className={s.header.title}>스마트머니</h1>
        </div>
        <SmartMoneyBootstrap />
        <ConcentratedBuyingSection />
        <SmartMoneyTab />
      </div>
    </div>
  );
}
