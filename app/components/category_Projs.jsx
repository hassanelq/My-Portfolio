import ProjectCard from "./project_card";
import Rectangle from "../../public/images/Rectangle.svg";
import Image from "next/image";

const CategoryProjects = ({ category }) => {
  return (
    <div className="flex flex-col items-center w-[80vw] m-auto">
      <Image
        src={Rectangle}
        className="absolute z-[-3] scale-125 lg:scale-100 px-0 lg:px-12 mt-16 sm:mt-12 md:mt-10 lg:mt-0"
      ></Image>
      <div className="text-center pt-20 w-[89%] opacity-85">
        <h2 className="font-medium text-[2.1rem]">{category.type}</h2>
        <p className="opacity-65 pt-3 font-light">{category.description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-6 pt-7 pb-4">
        {category.projects &&
          category.projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
      </div>
    </div>
  );
};

export default CategoryProjects;
