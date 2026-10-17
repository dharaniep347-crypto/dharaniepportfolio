import portraitAsset from "@/assets/dharani-portrait.jpg.asset.json";
import resumeAsset from "@/assets/Dharani_EP_Resume.pdf.asset.json";
// Edit all personal content here.
export const profile = {
  name: "Dharani E P",
  nameLines: ["Dharani", "E P"],
  title: "AI and Full Stack Developer",
  bio: "Third-year AI and Data Science student building AI-powered full-stack web apps.",
  synopsis: "I build AI-powered full-stack web apps with React, Spring Boot and Node.js.",
  about: [
    "I'm a third-year B.Tech student in Artificial Intelligence and Data Science at PGP College of Engineering and Technology. I'm interested in AI-powered full-stack development and in building useful applications that combine web technologies with AI.",
    "I work with React, Spring Boot, Node.js and Express, with MySQL and MongoDB for data and AWS for deployment. I'm eager to strengthen my practical skills through projects and collaborative learning.",
  ],
  location: "Karur, Tamil Nadu, India",
  email: "dharaniep347@gmail.com",
  phone: "+91 9159048874",
  linkedin: "https://www.linkedin.com/in/dharani-e-p-64a32b338",
  github: "https://github.com/dharaniep347-crypto",
  education:
    "B.Tech in Artificial Intelligence and Data Science (third year), PGP College of Engineering and Technology",
  resume: resumeAsset.url,
  // Set to an image URL (e.g. imported from src/assets) to show your portrait.
  portrait: portraitAsset.url as string,
};

export const skillCategories = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud and Tools",
] as const;
export type SkillCategory = (typeof skillCategories)[number];

export const skills: { name: string; level: number; category: SkillCategory }[] = [
  { name: "Python", level: 80, category: "Languages" },
  { name: "JavaScript", level: 85, category: "Languages" },
  { name: "SQL", level: 75, category: "Languages" },
  { name: "React.js", level: 85, category: "Frontend" },
  { name: "Tailwind CSS", level: 80, category: "Frontend" },
  { name: "Spring Boot", level: 70, category: "Backend" },
  { name: "Node.js", level: 75, category: "Backend" },
  { name: "Express.js", level: 75, category: "Backend" },
  { name: "MySQL", level: 75, category: "Databases" },
  { name: "MongoDB", level: 75, category: "Databases" },
  { name: "AWS", level: 60, category: "Cloud and Tools" },
  { name: "Git and GitHub", level: 80, category: "Cloud and Tools" },
];

export type Project = {
  title: string;
  category: "AI" | "Web";
  summary: string;
  description: string;
  tags: string[];
  demo: string;
  source: string;
};

export const projects: Project[] = [
  {
    title: "TravelMind: AI-Powered Personalized Itinerary Planner",
    category: "AI",
    summary: "Plans personalized travel itineraries with AI.",
    description:
      "TravelMind plans personalized travel itineraries with AI, combining a full-stack web app with AI-generated recommendations.",
    tags: ["AI", "Full Stack"],
    demo: "",
    source: "",
  },
  {
    title: "AI Learning Management System",
    category: "AI",
    summary: "An AI-focused LMS that supports digital learning workflows.",
    description:
      "An AI-focused learning management system that supports digital learning workflows.",
    tags: ["AI", "Full Stack"],
    demo: "",
    source: "",
  },
  {
    title: "My Portfolio",
    category: "Web",
    summary: "A 3D, streaming-style personal portfolio presenting my profile and projects.",
    description:
      "A 3D, streaming-style personal portfolio presenting my profile and projects.",
    tags: ["React", "Three.js", "Tailwind CSS"],
    demo: "",
    source: "",
  },
  {
    title: "Smart Irrigation Prediction",
    category: "AI",
    summary: "An agriculture-focused prediction project for smart irrigation.",
    description:
      "An agriculture-focused prediction project for smart irrigation.",
    tags: ["Python", "Data Science"],
    demo: "",
    source: "",
  },
];

/** "Continue watching"-style journey cards. */
export const journey = [
  {
    title: "B.Tech in Artificial Intelligence and Data Science",
    subtitle: "PGP College of Engineering and Technology · Year 3 of 4",
    progress: 75,
  },
  {
    title: "Learning AWS (EC2, S3, IAM)",
    subtitle: "Cloud deployment fundamentals",
    progress: 40,
  },
  {
    title: "Learning Spring Boot security",
    subtitle: "Authentication and authorization",
    progress: 50,
  },
];
