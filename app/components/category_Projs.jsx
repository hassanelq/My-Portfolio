import ProjectCard from "./project_card";
import Rectangle from "../../public/images/Rectangle.svg";
import Image from "next/image";

const CategoryProjects = ({ category }) => {
  return (
    <div className="flex flex-col items-center w-[80vw] m-auto">
      <Image src={Rectangle} className="absolute z-[-3] px-12"></Image>
      <div className="text-center pt-28 w-[89%]">
        <h2 className="font-medium text-[2rem]">{category.type}</h2>
        <p className="opacity-65 pt-3 font-light">{category.description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 py-10">
        {category.projects &&
          category.projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
      </div>
    </div>
  );
};

export default CategoryProjects;
