import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
import Retirement from "@/components/tools/retirement";
import EmergencyFund from "@/components/tools/emergency-fund";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description:
    "Explore historical monthly investing, retirement planning and an emergency cash fund for your household.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <ToolsWorkspace retirement={<Retirement />} emergency={<EmergencyFund />}>
        <DCA />
      </ToolsWorkspace>
    </div>
  );
}
