import Image from "next/image";
import Link from "next/link";
import githubLogo from "../../public/images/Logos/github.png";
import DemoIcon from "../../public/images/Logos/demo.svg";

const ProjectDetails = ({ project }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="gradient-card rounded-[25px] p-[6px]">
        <div className="bg-white dark:bg-gray-900 rounded-[25px] p-6">
          <Image
            src={project.image}
            alt="Project Image"
            className="rounded-[20px] w-full h-64 object-cover"
            width={1200}
            height={400}
          />

          <h1 className="text-2xl font-bold mt-6">{project.title}</h1>

          <p className="opacity-65 mt-2">{project.description}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#f5f5f594] rounded-[8px] px-2 py-1 text-black text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            {project.githubRepo && (
              <Link
                href={project.githubRepo}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Image src={githubLogo} alt="GitHub" className="h-5 w-5" />
                <span>GitHub Repository</span>
              </Link>
            )}

            {project.demo && (
              <Link
                href={project.demo}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Image src={DemoIcon} alt="Demo" className="h-5 w-5" />
                <span>Live Demo</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
