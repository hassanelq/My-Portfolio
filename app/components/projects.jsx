import projects from "../../database/projects";
import ProjectCard from "./Utils/project_card";

const Projects = () => {
  return (
    <section id="projects" className="px-[3.6vw] w-screen sm:px-[8vw]">
      <h2 className="text-center pb-5 text-[2.3rem] sm:text-[2.5rem] md:text-[2.7rem] font-semibold gradient-text">
        Featured Projects
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {projects &&
          projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
      </div>
    </section>
  );
};

export default Projects;
