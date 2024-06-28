import test from "../public/images/projects/projet1.png";
import clusteringProj from "../public/images/projects/clusteringProj.png";
const projects = [
  {
    type: "web development",
    description:
      "A personal portfolio website built with Next.js and Tailwind CSS.",
    projects: [
      {
        title: "Clustering Visualization App - Academic project",
        description:
          "I developed an interactive Clustering Visualization App using Streamlit to simplify clustering analysis for data scientists and enthusiasts. This app supports K-Means and Hierarchical clustering, integrates the Elbow Method for optimal cluster determination, and offers multiple data input methods (file upload, manual input, and random datasets).",
        image: clusteringProj,
        tags: ["Streamlit", "Python", "Pandas", "NumPy"],
        githubRepo:
          "https://github.com/hassanelq/Kmeans-and-herarchical-Clustering/",
        Demo: "https://kmeans-and-herarchicalc.streamlit.app/",
      },
      {
        title: "Website Portfolio Template test",
        description:
          "A personal portfolio website built with Next.js and Tailwind CSS.",
        image: test,
        tags: ["Next.js", "Tailwind CSS"],
        githubRepo: "/",
      },
      {
        title: "Website Portfolio Template test",
        description:
          "A personal portfolio website built with Next.js and Tailwind CSS.",
        image: test,
        tags: ["Next.js", "Tailwind CSS"],
        githubRepo: "/",
      },
      {
        title: "Website Portfolio Template test",
        description:
          "A personal portfolio website built with Next.js and Tailwind CSS.",
        image: test,
        tags: ["Next.js", "Tailwind CSS"],
        githubRepo: "/",
      },
    ],
  },
  {
    type: "data science",
    description:
      "A personal portfolio website built with Next.js and Tailwind CSS.",
    projects: [
      {
        title: "Website Portfolio Template",
        description:
          "A personal portfolio website built with Next.js and Tailwind CSS.",
        image: test,
        tags: ["Next.js", "Tailwind CSS"],
        githubRepo: "/",
      },
    ],
  },
];

export default projects;
