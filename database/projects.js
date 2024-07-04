import clusteringProj from "../public/images/projects/clusteringProj.png";
import ordinalsBot from "../public/images/projects/ordinalsBot.jpg";
import ambcheck from "../public/images/projects/ambcheck.png";
import ensaa from "../public/images/projects/ensaa.png";

const projects = [
  {
    type: "web development",
    description:
      "A collection of web development projects showcasing various technologies and frameworks.",
    projects: [
      {
        title: "Ensaa.ma - Website for ADE, Clubs, and the ENSA Community",
        description:
          "A dynamic platform for the ENSA community, providing news updates, information about ADE and clubs, and press releases. Designed with Next.js for a responsive and user-friendly experience.",
        image: ensaa,
        tags: ["Next.js", "Git", "GitHub", "Figma", "SCSS"],
        githubRepo: "https://github.com/XcodeXcodeX/Ensaa.ma",
        demo: "https://ensaa.ma/",
      },
      {
        title: "AMBcheck - NFT Discord Bot and Web App",
        description:
          "A comprehensive solution for user management in Ordinals communities, combining a Discord bot with a web app. Features include NFT ownership verification, wallet linking, and real-time updates.",
        image: ambcheck,
        tags: [
          "Node.js",
          "Next.js",
          "MongoDB",
          "Discord.js",
          "Figma",
          "GitHub",
          "Git",
        ],
        demo: "https://www.ambcheck.com/",
      },
    ],
  },
  {
    type: "data science",
    description:
      "Projects demonstrating the application of data science techniques and tools.",
    projects: [
      {
        title: "Clustering Visualization App - Academic Project",
        description:
          "An interactive app developed with Streamlit to simplify clustering analysis. Supports K-Means and Hierarchical clustering, integrates the Elbow Method, and offers multiple data input methods.",
        image: clusteringProj,
        tags: ["Streamlit", "Pandas", "NumPy", "Matplotlib"],
        githubRepo:
          "https://github.com/hassanelq/Kmeans-and-herarchical-Clustering/",
        demo: "https://kmeans-and-herarchicalc.streamlit.app/",
      },
    ],
  },
  {
    type: "automation",
    description: "Projects focused on automation and real-time data tracking.",
    projects: [
      {
        title: "Ordinals Sales Bot - Real-Time Sales Tracking and Alerts",
        description:
          "A solution for tracking and alerting sales activity within the Ordinals NFT ecosystem. Integrates with Discord and Twitter to provide real-time updates, customizable alerts, and comprehensive sales data.",
        image: ordinalsBot,
        tags: ["Node.js", "Discord.js", "Twitter API", "Linux Server"],
      },
    ],
  },
];

export default projects;
