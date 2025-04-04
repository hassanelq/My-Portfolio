import Image from "next/image";
import Link from "next/link";
// import githubLogo from "../../../public/images/Logos/github.png";
// import DemoIcon from "../../../public/images/Logos/demo.svg";

const ProjectItem = ({ project }) => {
  return (
    <div className="w-full gradient-card rounded-[25px] p-2">
      <Link href={`/projects/${project.id}`}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image Section */}
          <div className="md:w-1/3">
            <Image
              src={project.image}
              alt="Project Image"
              className="rounded-[25px] object-cover h-56 w-full"
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
              {project.longDescription}
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
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectItem;
