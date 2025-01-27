import Image from "next/image";
import Link from "next/link";
import githubLogo from "../../../public/images/Logos/github.png";
import DemoIcon from "../../../public/images/Logos/demo.svg";
import projects from "../../../database/projects";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export default function ProjectPage({ params }) {
  const project = projects.find((p) => p.id.toString() === params.id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl">Project not found</p>
        <Link href="/projects" className="mt-4 text-blue-500 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/projects"
          className="mb-8 pt-14 inline-flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          ← Back to Projects
        </Link>

        {/* Main Card */}
        <div className="gradient-card rounded-[25px] p-[6px]">
          <div className="p-6 space-y-8">
            {/* Header Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative h-64 md:h-80 rounded-[20px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-lg opacity-80">{project.longDescription}</p>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {project.githubRepo && (
                    <Link
                      href={project.githubRepo}
                      target="_blank"
                      className="flex gap-3 items-center py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.2)]"
                    >
                      <Image
                        src={githubLogo}
                        height={22}
                        width={22}
                        className="transition-transform duration-300 hover:scale-105"
                        alt="Github Logo"
                      />
                      <span className="text-[14px] lg:text-[15px] opacity-65 font-light">
                        GitHub Repository
                      </span>
                    </Link>
                  )}
                  {project.demo && (
                    <Link
                      href={project.demo}
                      target="_blank"
                      className="flex gap-3 items-center py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.2)]"
                    >
                      <Image
                        src={DemoIcon}
                        height={25}
                        width={25}
                        className="transition-transform duration-300 hover:scale-105"
                        alt="Demo Icon"
                      />
                      <span className="text-[14px] lg:text-[15px] opacity-65 font-light">
                        Live Demo
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Technologies Used */}
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Core Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.core.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#f5f5f594] dark:bg-gray-800 rounded-[8px] px-3 py-1.5 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.techStack.additional.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Additional Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.additional.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#e5e5e594] dark:bg-gray-700 rounded-[8px] px-3 py-1.5 text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">
                  Project Highlights
                </h2>
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Key Features */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-3">Key Features</h3>
                      <ul className="list-disc pl-4 space-y-2">
                        {project.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm opacity-80">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Specs */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-3">Technical Details</h3>
                      <ul className="list-disc pl-4 space-y-2">
                        <li className="text-sm opacity-80">
                          Built with {project.techStack.core.join(", ")}
                        </li>
                        <li className="text-sm opacity-80">
                          {project.techStack.additional.length}+ supporting
                          technologies
                        </li>
                        <li className="text-sm opacity-80">
                          Category:{" "}
                          {project.type.replace("-", " ").toUpperCase()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
