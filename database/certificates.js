import IBMLogo from "../public/images/Logos/IBM_logo.svg";
import MetaLogo from "../public/images/Logos/MetaLogo.png";
import metaBadge from "../public/images/badges/metaBadge.png";
import AIBadge from "../public/images/badges/AIBadge.png";
import DataIntroBadge from "../public/images/badges/DataIntroBadge.png";
import JPMorganLogo from "../public/images/Logos/JP-Morgan-Chase-Logo.svg";
import ForageLogo from "../public/images/Logos/ForageLogo.png";

const certificates = [
  {
    title:
      "JPMorgan Chase & Co. Quantitative Research Virtual Experience Program",
    Date: "April 2025",
    issuer: "JPMorgan Chase & Co.",
    IssuerLogo: ForageLogo,
    badge: JPMorganLogo,
    credentialUrl:
      "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Sj7temL583QAYpHXD/bWqaecPDbYAwSDqJy_Sj7temL583QAYpHXD_Mgtg87a49sG6jWBMG_1743875264410_completion_certificate.pdf",
    description:
      "This program provided a simulation of the quantitative research process, where I analyzed a book of loans to estimate a customer's probability of default. I also applied dynamic programming techniques to convert FICO scores into categorical data for predicting defaults.",
  },
  {
    title: "Data Science Orientation",
    Date: "July 03, 2024",
    issuer: "IBM",
    IssuerLogo: IBMLogo,
    badge: DataIntroBadge,
    credentialUrl:
      "https://www.credly.com/badges/d1e2b779-659d-48ad-8010-9c2e30e96c41/public_url",
    description:
      "This badge earner has a basic understanding of data science, AI, and machine learning, and their impact on business and research.",
  },
  {
    title: "Artificial Intelligence Fundamentals",
    Date: "June 24, 2024",
    issuer: "IBM",
    IssuerLogo: IBMLogo,
    badge: AIBadge,
    credentialUrl: "https://www.credly.com/go/UPMmU0QQ",
    description:
      "The earner understands AI concepts like NLP, computer vision, machine learning, and AI ethics. They can run AI models using IBM Watson Studio.",
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    Date: "June 7, 2024",
    issuer: "Meta",
    IssuerLogo: MetaLogo,
    badge: metaBadge,
    credentialUrl: "https://www.credly.com/go/FEWi6gnP",
    description:
      "This certificate covers front-end web development with React.js, preparing learners for entry-level roles through a series of Coursera courses and a capstone project.",
  },
];

export default certificates;
