import Image from "next/image";
import Link from "next/link";
// import githubLogo from "../../../public/images/Logos/github.png";
// import DemoIcon from "../../../public/images/Logos/demo.svg";

const ProjectItem = ({ project }) => {
  return (
    <div className="w-full gradient-card rounded-[25px] p-4">
      <Link href={`/projects/${project.id}`}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image Section */}
          <div className="md:w-1/3">
            <Image
              src={project.image}
              alt="Project Image"
              className="rounded-[25px] object-cover h-44 w-full"
              width={600}
              height={400}
            />
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 space-y-4 px-6 pb-4 md:p-0">
            <h2 className="text-[18px] lg:text-[20px] font-medium">
              {project.title}
            </h2>

            <p className="text-[14px] lg:text-[16px] pt-1 mb-2 opacity-65 font-light">
              {project.shortDescription}
            </p>

            <div className="flex flex-wrap gap-1">
              {project.techStack.core.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#f5f5f594] rounded-[8px] px-2 py-1 text-black text-[10px] lg:text-[12px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* <div className="flex gap-4 mt-4">
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
                  <p className="text-[14px] lg:text-[15px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                    Github repo
                  </p>
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
                  <p className="text-[14px] lg:text-[15px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                    Demo
                  </p>
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectItem;
