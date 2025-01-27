import clusteringProj from "../public/images/projects/clusteringProj.png";
import ordinalsBot from "../public/images/projects/ordinalsBot.jpg";
import ambcheck from "../public/images/projects/ambcheck.png";
import ensaa from "../public/images/projects/ensaa.png";
import proj_houseprice from "../public/images/projects/proj_houseprice.png";

const projects = [
  {
    id: "Agadir-House-Prices",
    title: "Agadir House Prices Prediction",
    shortDescription: "ML-powered real estate price estimation tool for Agadir",
    longDescription: `A comprehensive machine learning solution that estimates real estate prices in Agadir using advanced Gradient Boosting algorithms. Features include automated data collection through web scraping, REST API integration via Flask, and Docker containerization for seamless deployment. The system achieved 89% prediction accuracy through rigorous feature engineering and hyperparameter tuning.`,
    image: proj_houseprice,
    techStack: {
      core: ["Python", "Machine Learning", "Flask"],
      additional: [
        "Scikit-learn",
        "Pandas",
        "Docker",
        "BeautifulSoup",
        "PostgreSQL",
        "CI/CD",
      ],
    },
    demo: "https://agadir-house-prices.vercel.app/",
    githubRepo: "https://github.com/hassanelq/Agadir-House-Prices/",
    type: "data science",
    highlights: [
      "Real-time price predictions",
      "Automated data pipeline",
      "Production-ready API",
    ],
  },
  {
    id: "Ensaa.ma",
    title: "Ensaa.ma - ENSA Community Platform",
    shortDescription: "Official website for ENSA Agadir community",
    longDescription: `A full-stack platform serving 5000+ students and faculty members, featuring real-time updates, event management, and secure authentication. Built with Next.js for server-side rendering and optimized performance. Integrated with a headless CMS for content management and featuring a custom design system.`,
    image: ensaa,
    techStack: {
      core: ["Next.js", "TypeScript", "Figma"],
      additional: [
        "Tailwind CSS",
        "Sanity CMS",
        "SSR",
        "JWT Auth",
        "Vercel Analytics",
        "Git Actions",
      ],
    },
    githubRepo: "https://github.com/XcodeXcodeX/Ensaa.ma",
    demo: "https://ensaa.ma/",
    type: "web development",
    highlights: [
      "Mobile-first responsive design",
      "CMS integration",
      "Performance optimization",
    ],
  },
  {
    id: "Clustering-Visualization-App",
    title: "Clustering Visualization Platform",
    shortDescription: "Interactive clustering analysis web application",
    longDescription: `An academic project providing visual exploration of clustering algorithms with real-time parameter adjustments. Supports K-Means, Hierarchical, and DBSCAN clustering with automated elbow method detection. Features CSV upload and live dataset generation capabilities.`,
    image: clusteringProj,
    techStack: {
      core: ["Streamlit", "Scikit-learn", "Matplotlib"],
      additional: [
        "NumPy",
        "Pandas",
        "Plotly",
        "Dimensionality Reduction",
        "Data Visualization",
      ],
    },
    githubRepo:
      "https://github.com/hassanelq/Kmeans-and-herarchical-Clustering/",
    demo: "https://kmeans-and-herarchicalc.streamlit.app/",
    type: "data science",
    highlights: [
      "Interactive visualization",
      "Multiple algorithm support",
      "Educational tool",
    ],
  },
  {
    id: "AMBcheck",
    title: "AMBcheck - NFT Community Suite",
    shortDescription: "NFT verification and community management system",
    longDescription: `A full-stack solution managing 50+ NFT communities with 15,000+ users. Features Discord bot integration for role management, Next.js dashboard for analytics, and MongoDB for real-time data storage. Implemented OAuth2 authentication and blockchain verification.`,
    image: ambcheck,
    techStack: {
      core: ["Next.js", "Node.js", "MongoDB"],
      additional: [
        "Discord.js",
        "Web3.js",
        "Redis",
        "JWT",
        "AWS EC2",
        "Load Balancing",
      ],
    },
    demo: "https://www.ambcheck.com/",
    type: "web development",
    highlights: [
      "Blockchain integration",
      "Real-time updates",
      "Scalable architecture",
    ],
  },
  {
    id: "Ordinals-Sales-Bot",
    title: "Ordinals Market Tracker",
    shortDescription: "Real-time NFT sales monitoring system",
    longDescription: `A high-frequency trading bot monitoring Ordinals NFT markets, processing 100+ transactions/minute. Features Discord and Twitter integration for instant alerts, historical data analysis, and custom notification thresholds. Deployed on Linux servers with PM2 process management.`,
    image: ordinalsBot,
    techStack: {
      core: ["Node.js", "Discord.js", "Twitter API"],
      additional: [
        "WebSockets",
        "Redis",
        "Rate Limiting",
        "PM2",
        "Ubuntu Server",
        "API Design",
      ],
    },
    type: "automation",
    highlights: [
      "Real-time monitoring",
      "Cross-platform notifications",
      "High-performance architecture",
    ],
  },
];

export default projects;
