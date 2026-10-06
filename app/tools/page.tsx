import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
import Retirement from "@/components/tools/retirement";
import EmergencyFund from "@/components/tools/emergency-fund";
import RentBuy from "@/components/tools/rent-buy";
import InvestmentFees from "@/components/tools/investment-fees";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description:
    "Explore monthly investing, retirement, emergency savings, renting or buying a home, and the long-term cost of investment fees.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <ToolsWorkspace
        retirement={<Retirement />}
        emergency={<EmergencyFund />}
        rentBuy={<RentBuy />}
        fees={<InvestmentFees />}
      >
        <DCA />
      </ToolsWorkspace>
    </div>
  );
}
