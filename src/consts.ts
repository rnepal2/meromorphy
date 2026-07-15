import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Meromorphy",
  URL: "https://meromorphy.com",
  AUTHOR: "Rabindra Nepal",
  TAGLINE: "Almost Understood. Beautifully Broken.",
  TOPICS: [
    "science",
    "technology",
    "artificial intelligence",
    "machine learning",
    "data science",
    "mathematics",
    "innovation",
    "personal essays",
  ],
  EMAIL: "",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Meromorphy is Rabindra Nepal's independent website for essays and interactive projects on science, mathematics, data science, AI, innovation, and human experience.",
};

export const RESIDUES: Metadata = {
  TITLE: "Residues",
  DESCRIPTION: "Personal essays and interactive articles exploring science, mathematics, artificial intelligence, innovation, life, and human experience.",
};

export const ARTIFACTS: Metadata = {
  TITLE: "Artifacts",
  DESCRIPTION:
    "Interactive projects and technical articles in data science, machine learning, artificial intelligence, and scientific computing.",
};

export const MANIFOLD: Metadata = {
  TITLE: "Manifold",
  DESCRIPTION: "About Rabindra Nepal, a scientist and data scientist working across physics, machine learning, generative AI, and innovation.",
};

export const INTERFACE: Metadata = {
  TITLE: "Interface",
  DESCRIPTION: "Contact Rabindra Nepal about Meromorphy, science, data science, artificial intelligence, research, and related ideas.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/rnepal2",
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/nepalrabindra/",
  },
  {
    NAME: "twitter-x",
    HREF: "https://x.com/ccRabindra",
  },
  {
    NAME: "google-scholar",
    HREF: "https://scholar.google.com/citations?user=Z8tzkKEAAAAJ&hl=en",
  },
];
