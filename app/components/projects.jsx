import CategoryProjects from "./category_Projs";
import projects from "../../database/projects";

const Projects = () => {
  return (
    <section className="py-8">
      <h2 className="text-center text-[2.7rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
        Featured Projects
      </h2>
      <div>
        {projects &&
          projects.map((category, index) => (
            <CategoryProjects key={index} category={category} />
          ))}
      </div>
    </section>
  );
};

export default Projects;
