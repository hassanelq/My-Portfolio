import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { pageIntros } from "@/content/site";
import { ProjectCatalog } from "@/components/projects/project-catalog";
export const metadata: Metadata = {
  title: "Projects",
  description: pageIntros.projects.description,
  alternates: { canonical: "/projects" },
};
export default function ProjectsPage() {
  return (
    <div className="page-container">
      <PageHeading {...pageIntros.projects} />
      <ProjectCatalog />
    </div>
  );
}
