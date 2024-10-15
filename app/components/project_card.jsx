import Image from "next/image";
import Link from "next/link";
import githubLogo from "../../public/images/Logos/github.png";
import DemoIcon from "../../public/images/Logos/demo.svg";

const ProjectCard = ({ project }) => {
  return (
    <div className="flex h-fit mx-2 w-[350px] lg:w-[400px] p-[6px] flex-col items-start gap-[6px] gradient-card">
      <Image
        src={project.image}
        className="rounded-[25px]"
        alt="Project Image"
      ></Image>
      <div className="pt-1 pb-3 px-3 sm:px-5">
        <h2 className="text-[18px] lg:text-[20px] font-medium">
          {project.title}
        </h2>
        <p className="text-[14px] lg:text-[16px] pt-1 mb-2 opacity-65 font-light ">
          {/* line-clamp-3 */}
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#f5f5f594] rounded-[10px] px-[10px] py-[5px] text-[black] text-[12px] lg:text-[14px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2 pt-3">
          {project.githubRepo && (
            <Link
              href={project.githubRepo}
              target="_blank"
              className="flex gap-3 items-center mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.2)]"
            >
              <Image
                src={githubLogo}
                height={22}
                width={22}
                className="transition-transform duration-300 hover:scale-105"
                alt="Github Logo"
              ></Image>
              <p className="text-[14px] lg:text-[15px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                Github repo
              </p>
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              className="flex gap-3 items-center mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.2)]"
            >
              <Image
                src={DemoIcon}
                height={25}
                width={25}
                className="transition-transform duration-300 hover:scale-105"
                alt="Demo Icon"
              ></Image>
              <p className="text-[14px] lg:text-[15px] opacity-65 font-light transition-colors duration-300 hover:text-gray-300">
                Demo
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
