import Image from "next/image";
const ProjectCard = ({ project }) => {
  return (
    <div className="flex w-[400px] p-[6px] flex-col items-start gap-[6px] rounded-[32px] border-[0px] bg-[radial-gradient(100%_100%_at_50%_0%,_rgba(255,_255,_255,_0.20)_0%,_rgba(255,_255,_255,_0.02)_100%)] [box-shadow:0px] backdrop-filter">
      <Image src={project.image} className="rounded-[25px]"></Image>
      <div className="pt-1 pb-3 px-5">
        <h2 className="text-[20px] font-medium">{project.title}</h2>
        <p className="text-[16px] pt-1 pb-2 opacity-65 font-light">
          {project.description}
        </p>
        <div className="flex gap-1">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#F5F5F5CC] rounded-[10px] px-[10px] py-[5px] text-[black] text-[14px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
