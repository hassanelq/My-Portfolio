import clusteringProj from "../public/images/projects/clusteringProj.png";
import ordinalsBot from "../public/images/projects/ordinalsBot.jpg";
import ambcheck from "../public/images/projects/ambcheck.png";
import ensaa from "../public/images/projects/ensaa.png";
import proj_houseprice from "../public/images/projects/proj_houseprice.png";

const projects = [
  {
    title: "Agadir House Prices Prediction",
    description:
      "A tool for estimating real estate prices in Agadir using machine learning. Features real-time price predictions with an advanced Gradient Boosting Regressor model.",
    image: proj_houseprice,
    tags: [
      "Python",
      "Data Science",
      "Machine Learning",
      "Web scraping",
      "Flask",
      "Linear Regression",
      "Web Development",
      "Docker",
    ],
    demo: "https://agadir-house-prices.vercel.app/",
    githubRepo: "https://github.com/hassanelq/Agadir-House-Prices/",
    type: "Machine Learning",
  },

  {
    title: "Ensaa.ma - Website for ADE, Clubs, and the ENSA Community",
    description:
      "A platform for the ENSA community, offering news updates, ADE and club information, and press releases. Built with Next.js for a responsive experience.",
    image: ensaa,
    tags: ["Next.js", "Git", "GitHub", "Figma", "SCSS"],
    githubRepo: "https://github.com/XcodeXcodeX/Ensaa.ma",
    demo: "https://ensaa.ma/",
    type: "web development",
  },
  {
    title: "AMBcheck - NFT Discord Bot and Web App",
    description:
      "A user management solution for Ordinals communities, featuring NFT ownership verification, wallet linking, and real-time updates.",
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
    type: "web development",
  },
  {
    title: "Clustering Visualization App - Academic Project",
    description:
      "An app using Streamlit for clustering analysis, supporting K-Means and Hierarchical clustering with the Elbow Method and multiple data input methods.",
    image: clusteringProj,
    tags: ["Streamlit", "Pandas", "NumPy", "Matplotlib"],
    githubRepo:
      "https://github.com/hassanelq/Kmeans-and-herarchical-Clustering/",
    demo: "https://kmeans-and-herarchicalc.streamlit.app/",
    type: "data science",
  },
  {
    title: "Ordinals Sales Bot - Real-Time Sales Tracking and Alerts",
    description:
      "Tracks and alerts sales activity within the Ordinals NFT ecosystem, integrating with Discord and Twitter for real-time updates.",
    image: ordinalsBot,
    tags: ["Node.js", "Discord.js", "Twitter API", "Linux Server"],
    type: "automation",
  },
];

export default projects;

// const projects = [
//   {
//     type: "web development",
//     description:
//       "A collection of web development projects showcasing various technologies and frameworks.",
//     projects: [
//       {
//         title: "Ensaa.ma - Website for ADE, Clubs, and the ENSA Community",
//         description:
//           "A platform for the ENSA community, offering news updates, ADE and club information, and press releases. Built with Next.js for a responsive experience.",
//         image: ensaa,
//         tags: ["Next.js", "Git", "GitHub", "Figma", "SCSS"],
//         githubRepo: "https://github.com/XcodeXcodeX/Ensaa.ma",
//         demo: "https://ensaa.ma/",
//       },
//       {
//         title: "AMBcheck - NFT Discord Bot and Web App",
//         description:
//           "A user management solution for Ordinals communities, featuring NFT ownership verification, wallet linking, and real-time updates.",
//         image: ambcheck,
//         tags: [
//           "Node.js",
//           "Next.js",
//           "MongoDB",
//           "Discord.js",
//           "Figma",
//           "GitHub",
//           "Git",
//         ],
//         demo: "https://www.ambcheck.com/",
//       },
//     ],
//   },
//   {
//     type: "data science",
//     description:
//       "Projects demonstrating the application of data science techniques and tools.",
//     projects: [
//       {
//         title: "Clustering Visualization App - Academic Project",
//         description:
//           "An app using Streamlit for clustering analysis, supporting K-Means and Hierarchical clustering with the Elbow Method and multiple data input methods.",
//         image: clusteringProj,
//         tags: ["Streamlit", "Pandas", "NumPy", "Matplotlib"],
//         githubRepo:
//           "https://github.com/hassanelq/Kmeans-and-herarchical-Clustering/",
//         demo: "https://kmeans-and-herarchicalc.streamlit.app/",
//       },
//     ],
//   },
//   {
//     type: "automation",
//     description: "Projects focused on automation and real-time data tracking.",
//     projects: [
//       {
//         title: "Ordinals Sales Bot - Real-Time Sales Tracking and Alerts",
//         description:
//           "Tracks and alerts sales activity within the Ordinals NFT ecosystem, integrating with Discord and Twitter for real-time updates.",
//         image: ordinalsBot,
//         tags: ["Node.js", "Discord.js", "Twitter API", "Linux Server"],
//       },
//     ],
//   },
// ];
