import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
import Retirement from "@/components/tools/retirement";
import EmergencyFund from "@/components/tools/emergency-fund";
import RentBuy from "@/components/tools/rent-buy";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description:
    "Explore monthly investing, retirement, emergency savings and the financial trade-offs of renting or buying a home.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <ToolsWorkspace
        retirement={<Retirement />}
        emergency={<EmergencyFund />}
        rentBuy={<RentBuy />}
      >
        <DCA />
      </ToolsWorkspace>
    </div>
  );
}
