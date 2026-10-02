import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
import Retirement from "@/components/tools/retirement";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description:
    "Explore monthly investing and retirement planning with historical market returns and inflation-adjusted calculations.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <ToolsWorkspace retirement={<Retirement />}>
        <DCA />
      </ToolsWorkspace>
    </div>
  );
}
