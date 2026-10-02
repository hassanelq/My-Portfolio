const redirects = {
  "/about": "/#about",
  "/contact": "/#contact",
  "/blogs": "/articles",
  "/CV_Hassan.pdf": "/cv/hassan-elqadi-en.pdf",
  "/projects/Option-Pricing-models": "/projects#options-pricing",
  "/projects/MonteCarlo-Finance-Simulator": "/lab#monte-carlo",
  "/projects/Stock-Sentiment-Analyzer": "/projects#finbert",
  "/projects/Agadir-House-Prices": "/projects#real-estate",
  "/projects/Ensaa.ma": "/projects",
  "/projects/Clustering-Visualization-App": "/projects",
  "/projects/AMBcheck": "/projects#ordinals",
  "/projects/Ordinals-Sales-Bot": "/projects#ordinals",
};
const nextConfig = {
  async redirects() {
    return Object.entries(redirects).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
