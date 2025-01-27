"use client";
import { useState } from "react";
import projects from "../../database/projects";
import ProjectItem from "../components/Utils/projectItem";

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "quantitative finance",
    "web development",
    "data science",
    "automation",
  ];

  const filteredProjects = projects.filter((project) =>
    selectedCategory === "all"
      ? true
      : project.type.toLowerCase() === selectedCategory
  );

  return (
    <div className="px-[3.6vw] w-screen sm:px-[8vw] pt-[15vh] min-h-screen">
      <h2 className="text-center pb-5 text-[2.3rem] sm:text-[2.5rem] md:text-[2.7rem] font-semibold gradient-text">
        Featured Projects
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project, index) => (
          <ProjectItem key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
