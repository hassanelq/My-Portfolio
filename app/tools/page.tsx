import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description:
    "Explore monthly investing with historical S&P 500, gold and MSCI World returns, adjusted for Moroccan inflation.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <ToolsWorkspace>
        <DCA />
      </ToolsWorkspace>
    </div>
  );
}
