import Image from "next/image";
import Link from "next/link";
import githubLogo from "../../public/images/Logos/github.png";
import DemoIcon from "../../public/images/Logos/demo.svg";

const ProjectCard = ({ project }) => {
  return (
    <div className="flex h-fit w-[350px] lg:w-[400px] p-[6px] flex-col items-start gap-[6px] rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
      <Image src={project.image} className="rounded-[25px]"></Image>
      <div className="pt-1 pb-3 px-2 sm:px-5 w-[100%]">
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
              className="flex gap-3 items-center 	mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)]"
            >
              <Image src={githubLogo} height={22}></Image>
              <p className="text-[14px] lg:text-[15px] opacity-65 font-light">
                Github repo
              </p>
            </Link>
          )}
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              className="flex gap-3 items-center 	mt-2 py-2 px-4 w-fit rounded-[25px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.10)_0%,_rgba(255,_255,_255,_0.05)_100%)]"
            >
              <Image src={DemoIcon} height={25}></Image>
              <p className="text-[14px] lg:text-[15px] opacity-65 font-light">
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
