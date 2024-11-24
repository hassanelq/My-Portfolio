import projects from "../../database/projects";
import ProjectCard from "../components/Utils/project_card";

const ProjectsPage = () => {
  return (
    <div className="px-[3.6vw] h-auto w-screen sm:px-[8vw] pt-[15vh]">
      <h2 className="text-center pb-5 text-[2.3rem] sm:text-[2.5rem] md:text-[2.7rem] font-semibold gradient-text">
        Featured Projects
      </h2>
      <div className="flex flex-wrap gap-4">
        {projects &&
          projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
