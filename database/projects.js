import clusteringProj from "../public/images/projects/clusteringProj.png";
import ordinalsBot from "../public/images/projects/ordinalsBot.jpg";
import ambcheck from "../public/images/projects/ambcheck.png";
import ensaa from "../public/images/projects/ensaa.png";
import proj_houseprice from "../public/images/projects/proj_houseprice.png";
import sentimentApp from "../public/images/projects/sentimentApp.png";
import montecarloSim from "../public/images/projects/montecarloSim.png";
import optionpricing from "../public/images/projects/optionpricing.png";

const projects = [
  {
    id: "Option-Pricing-models",
    title: "Option Pricing models",
    shortDescription: "Advanced option pricing and Greeks calculator",
    longDescription:
      "Calculate option prices and Greeks using different pricing models with our advanced financial modeling tools. Fetch market data, compare methods, and visualize results in real-time.",
    image: optionpricing,
    techStack: {
      core: [
        "Black Sholes Merton",
        "Heston Model",
        "Ornstein-Uhlenbeck Process",
      ],
      additional: [
        "Next.js",
        "Tailwind CSS",
        "Volatility Modeling",
        "Monte Carlo Methods",
        "Brownian Motion",
        "Probability Theory",
        "Options Pricing",
        "Financial Modeling",
      ],
    },
    demo: "https://options-price.vercel.app/",
    type: "quantitative finance",
    highlights: [
      "Real-time option pricing calculations",
      "Supports multiple pricing models",
      "Interactive data visualization",
      "User-friendly interface",
      "Comprehensive financial analytics tools",
    ],
  },
  {
    id: "MonteCarlo-Finance-Simulator",
    title: "Monte Carlo Financial Simulation Platform",

    shortDescription:
      "Interactive finance modeling using Monte Carlo simulations",
    longDescription: `An educational and interactive web platform for simulating core quantitative finance models. Built with Next.js and Chart.js, the application allows users to explore investment scenarios, options pricing, and statistical distributions using Monte Carlo techniques. Designed to help students and professionals understand risk, volatility, and asset dynamics through hands-on simulation and visualization.`,
    image: montecarloSim,
    techStack: {
      core: [
        "Monte Carlo Methods",
        "Brownian Motion",
        "Probability Theory",
        "Options Pricing",
      ],
      additional: [
        "Next.js",
        "Chart.js",
        "Tailwind CSS",
        "Geometric Brownian Motion",
        "Financial Modeling",
        "React Hooks",
        "Dynamic Simulation Engines",
        "Data Visualization",
        "Volatility Modeling",
      ],
    },
    githubRepo: "https://github.com/hassanelq/simulations-montecarlo",
    demo: "https://simulations-mc.vercel.app/",
    type: "quantitative finance",
    highlights: [
      "Simulates investment growth with volatility",
      "Options pricing via Monte Carlo",
      "Visualizes 15+ probability distributions",
      "Interactive parameter adjustments",
      "Supports rare-event modeling",
    ],
  },
  {
    id: "Stock-Sentiment-Analyzer",
    title: "Stock Sentiment Analysis & Prediction App",
    shortDescription: "Multi-source sentiment analysis with stock prediction",
    longDescription: `A full-stack web application that performs real-time sentiment analysis of stocks using Reddit, Twitter, and FinViz data. Built with FastAPI and Next.js, it scrapes recent news and social media posts, processes them using FinBERT transformer models, and predicts if a stock is likely to go UP or DOWN. Features rich data visualizations, platform selection, and adjustable analysis timeframe.`,
    image: sentimentApp,
    techStack: {
      core: ["FastAPI", "FinBERT", "Sentiment Aggregation", "NLP"],
      additional: [
        "Next.js",
        "BeautifulSoup",
        "AsyncPRAW",
        "Twikit",
        "HuggingFace Transformers",
        "PyTorch",
        "Chart.js",
        "Pandas",
        "Scikit-learn",
        "Text Cleaning",
        "Token Classification",
      ],
    },
    githubRepo: "https://github.com/hassanelq/Stocks-sentiment-analysis",
    demo: "https://stocks-sentiment-analysis0.vercel.app/",
    type: "data science",
    highlights: [
      "Multi-platform scraping support",
      "Transformer-based sentiment prediction",
      "Interactive visualizations (charts & breakdowns)",
      "Real-time forecasting engine",
      "Configurable prediction thresholds",
    ],
  },
  {
    id: "Agadir-House-Prices",
    title: "Agadir House Prices Prediction",
    shortDescription: "ML-powered real estate price estimation tool for Agadir",
    longDescription: `A comprehensive machine learning solution that estimates real estate prices in Agadir using advanced Gradient Boosting algorithms. Features include automated data collection through web scraping, REST API integration via Flask, and Docker containerization for seamless deployment. The system achieved 89% prediction accuracy through rigorous feature engineering and hyperparameter tuning.`,
    image: proj_houseprice,
    techStack: {
      core: [
        "Gradient Boosting",
        "Flask API",
        "Regression Models",
        "Scikit-learn",
      ],
      additional: [
        "Pandas",
        "Docker",
        "BeautifulSoup",
        "PostgreSQL",
        "Feature Engineering",
        "Grid Search",
        "Joblib",
        "Matplotlib",
        "Data Cleaning",
      ],
    },
    demo: "https://agadir-house-prices.vercel.app/",
    githubRepo: "https://github.com/hassanelq/Agadir-House-Prices/",
    type: "data science",
    highlights: [
      "Real-time price predictions",
      "Automated data pipeline",
      "Production-ready API",
      "Customizable inputs for features",
      "Scalable ML backend",
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
      core: ["Streamlit", "Scikit-learn", "K-means", "Hierarchical Clustering"],
      additional: [
        "NumPy",
        "Pandas",
        "Plotly",
        "Dimensionality Reduction",
        "Data Visualization",
        "Matplotlib",
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
