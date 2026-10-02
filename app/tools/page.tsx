import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import DCA from "@/components/tools/dca";
export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Financial Tools",
  description: pageIntros.tools.description,
};
export default function ToolsPage() {
  return (
    <div className="page-container">
      <PageHeading {...pageIntros.tools} />
      <DCA />
    </div>
  );
}
