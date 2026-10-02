import type { Metadata } from "next";
import DCA from "@/components/tools/dca";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "DCA Simulator",
  description:
    "Explore monthly investing with historical S&P 500, gold and MSCI World returns, adjusted for Moroccan inflation.",
};
export default function ToolsPage() {
  return (
    <div className="page-container tools-page">
      <DCA />
    </div>
  );
}
