import portraitAsset from "@/assets/dharani-portrait.jpg.asset.json";
import resumeAsset from "@/assets/Dharani_E_P_-_Resume.pdf.asset.json";
import { normalizeExternalUrl } from "@/lib/external-url";
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
  linkedin: normalizeExternalUrl("https://www.linkedin.com/in/dharani-e-p-64a32b338"),
  github: normalizeExternalUrl("https://github.com/dharaniep347-crypto"),
  education:
    "B.Tech in Artificial Intelligence and Data Science (2024 – 2028, third year), PGP College of Engineering and Technology",
  resume: normalizeExternalUrl(resumeAsset.url),
  // Set to an image URL (e.g. imported from src/assets) to show your portrait.
  portrait: normalizeExternalUrl(portraitAsset.url),
};

export const skillCategories = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud and Tools",
] as const;
export type SkillCategory = (typeof skillCategories)[number];

export const skillDetails: Record<string, string> = {
  "React.js": "Hooks, Context API, Protected Routes",
  "Spring Boot": "REST APIs, JPA, JWT Authentication, Role-Based Access",
  AWS: "EC2, S3, IAM basics",
  Languages: "Python, JavaScript, SQL",
  Databases: "MySQL, MongoDB",
  Tools: "Git, GitHub",
  "Git and GitHub": "Git, GitHub",
};

export const projectCategories = ["All", "AI and Full Stack", "AI and Data Science", "Web"] as const;
export type ProjectCategoryFilter = (typeof projectCategories)[number];

export function filterProjects<T extends { category: string }>(items: T[], category: ProjectCategoryFilter): T[] {
  return category === "All" ? items : items.filter((p) => p.category === category);
}

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
  category: "AI and Full Stack" | "AI and Data Science" | "Web";
  summary: string;
  description: string;
  tags: string[];
  demo: string;
  source: string;
};

export const projects: Project[] = [
  {
    "title": "TravelMind: AI-Powered Personalized Itinerary Planner",
    "category": "AI and Full Stack",
    "summary": "Creates personalized day-wise travel itineraries from a traveller's interests, budget and trip duration.",
    "description": "<h3>Purpose</h3><p>Create personalized travel itineraries based on a traveller&#x27;s interests, destination, budget and trip duration.</p><h3>Benefit</h3><p>Helps travellers plan trips more efficiently and find options aligned with their preferences.</p><h3>What I built</h3><ul><li>A full-stack planner with a React.js frontend and a Spring Boot REST API, where users enter destination, interests, budget and trip duration to generate a customised plan.</li><li>AI-based itinerary generation that turns traveller preferences into structured, day-wise schedules with attraction and activity suggestions.</li><li>Secure JWT-based authentication with protected routes, so each user can save, view and revisit their own itineraries.</li><li>A responsive Tailwind CSS interface with an organized day-by-day itinerary view, with user and trip data stored in MySQL using JPA.</li></ul>",
    "tags": [
      "React.js",
      "Spring Boot",
      "MySQL",
      "JPA",
      "JWT",
      "Tailwind CSS",
      "AI"
    ],
    "demo": "",
    "source": ""
  },
  {
    "title": "AI Learning Management System",
    "category": "AI and Full Stack",
    "summary": "A learning platform with course materials, progress tracking and an AI study assistant.",
    "description": "<h3>Purpose</h3><p>Support digital learning by bringing course materials and learner progress into one platform with AI-assisted support.</p><h3>Benefit</h3><p>Helps learners find relevant resources and organize their study plans.</p><h3>What I built</h3><ul><li>A learning platform where learners browse courses, access study materials and track their progress from a single dashboard.</li><li>Role-based access for learners and administrators using Spring Boot and JWT, controlling who can create courses, upload content and view progress.</li><li>An AI study assistant and personalized recommendations that suggest relevant resources based on a learner&#x27;s courses and activity.</li><li>Progress-tracking workflows in a React.js interface using Context API for state management, backed by a MySQL database for courses, users and learner records.</li></ul>",
    "tags": [
      "React.js",
      "Context API",
      "Spring Boot",
      "JWT",
      "MySQL",
      "AI"
    ],
    "demo": "",
    "source": ""
  },
  {
    "title": "My Portfolio: Personal Portfolio Website",
    "category": "Web",
    "summary": "A responsive portfolio presenting my profile, skills and projects in one place.",
    "description": "<h3>Purpose</h3><p>Present profile information, technical skills, projects and achievements in one place.</p><h3>Benefit</h3><p>Gives recruiters and collaborators a central place to review my work and contact me.</p><h3>What I built</h3><ul><li>A responsive personal portfolio with React.js and Tailwind CSS that presents profile, skills, projects and achievements in clearly organised sections.</li><li>Project summaries with links to source code and live demos so recruiters can review work quickly.</li><li>A consistent layout across mobile, tablet and desktop screen sizes, with contact details for easy outreach.</li><li>Version control with Git and GitHub, deployed and accessible through a shareable link.</li></ul>",
    "tags": [
      "React.js",
      "Tailwind CSS",
      "Git",
      "GitHub"
    ],
    "demo": "",
    "source": ""
  },
  {
    "title": "Smart Irrigation Prediction (Agriculture)",
    "category": "AI and Data Science",
    "summary": "A machine learning model that predicts irrigation need from soil and weather data.",
    "description": "<h3>Purpose</h3><p>Support irrigation decisions using relevant agricultural, field and environmental data.</p><h3>Benefit</h3><p>Supports more efficient water use and data-informed irrigation planning.</p><h3>What I built</h3><ul><li>A machine learning model in Python that predicts irrigation need from inputs such as soil moisture, temperature, humidity and rainfall.</li><li>Cleaned and preprocessed the agricultural dataset, handling missing values and selecting the features that most influence water requirement.</li><li>Trained and evaluated classification models, comparing performance to choose the most reliable one for irrigation recommendations.</li><li>Presented predictions in a simple, easy-to-read format so farmers can make data-informed irrigation decisions and use water more efficiently.</li></ul>",
    "tags": [
      "Python",
      "Machine Learning",
      "Data Science"
    ],
    "demo": "",
    "source": ""
  }
];

/** "Continue watching"-style journey cards. */
export const journey = [
  {
    title: "B.Tech in Artificial Intelligence and Data Science",
    subtitle: "PGP College of Engineering and Technology · 2024 – 2028 · Year 3 of 4",
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

/** Academic content: null/empty values are intentionally unknown, never estimates. */
export type EducationEntry = {
  id: string; institution: string; qualification: string; years: string;
  status: string; board: string; score: string; group: string;
  expectedGraduation?: number; overallCgpa?: number | null;
  currentSemester?: number; totalSemesters?: number;
  semesters?: { semester: number; cgpa: number | null }[];
  medium?: string; subjects?: { subject: string; marks: number }[];
  topSubject?: string; marksBasis?: string;
};
export const education: EducationEntry[] = [
  {
    id: "btech", institution: "PGP College of Engineering and Technology",
    qualification: "B.Tech in Artificial Intelligence and Data Science",
    years: "2024 – 2028", status: "Pursuing, third year", expectedGraduation: 2028,
    board: "", score: "", group: "", overallCgpa: 8.03,
    currentSemester: 5, totalSemesters: 8,
    semesters: [{ semester: 1, cgpa: 7.86 }, { semester: 2, cgpa: 7.86 }, { semester: 3, cgpa: 8.18 }, { semester: 4, cgpa: 8.08 }, { semester: 5, cgpa: null }],
  },
  {
    id: "higher-secondary", institution: "Govt Hr Sec School, Kaniyalampatti, Karur",
    qualification: "Higher Secondary (12th)", years: "March 2024", status: "Passed",
    board: "State Board of School Examinations, Tamil Nadu", score: "461 / 600 (76.8%)",
    group: "General Education (Physics, Chemistry, Biology, Maths)", medium: "Tamil",
    marksBasis: "Out of 100 · theory + practical + internal", topSubject: "Chemistry",
    subjects: [{ subject: "Tamil", marks: 97 }, { subject: "English", marks: 75 }, { subject: "Physics", marks: 65 }, { subject: "Chemistry", marks: 85 }, { subject: "Biology", marks: 73 }, { subject: "Mathematics", marks: 66 }],
  },
  {
    id: "secondary", institution: "Government High School, Thennilai, Kadavur",
    qualification: "Secondary (10th)", years: "May 2022", status: "Passed",
    board: "State Board of School Examinations, Tamil Nadu", score: "398 / 500 (79.6%)",
    group: "", medium: "Tamil", marksBasis: "Out of 100", topSubject: "Social Science",
    subjects: [{ subject: "Tamil", marks: 86 }, { subject: "English", marks: 77 }, { subject: "Mathematics", marks: 70 }, { subject: "Science", marks: 75 }, { subject: "Social Science", marks: 90 }],
  },
];

export function academicStats(entry: EducationEntry) {
  const completed = (entry.semesters ?? []).filter((s): s is { semester: number; cgpa: number } => typeof s.cgpa === "number" && s.cgpa >= 0 && s.cgpa <= 10);
  return { completed, overall: entry.overallCgpa ?? null, highest: completed.length ? Math.max(...completed.map((s) => s.cgpa)) : null, count: completed.length || null };
}

export const certificateCategories = ["All", "AI", "Web", "Cloud", "Other"] as const;
export type CertificateCategory = (typeof certificateCategories)[number];
export type Certificate = {
  id: string; title: string; issuer: string; date: string;
  category: Exclude<CertificateCategory, "All">; description: string;
  image: string; file: string; credential: string;
};
export const certificates: Certificate[] = [
  { id: "hackxtreme", title: "HackXtreme ’26 — 24-hour National Level Hackathon", issuer: "K. Ramakrishnan College of Engineering", date: "9–10 April 2026", category: "Other", description: "Participated in the 24-hour national-level hackathon organised by the departments of AI&DS, AI&ML, CSBS, CSE and IT in Trichy.", image: "/certificates/hackxtreme-26.jpg", file: "/certificates/hackxtreme-26.jpg", credential: "" },
  { id: "texperia", title: "TEXPERIA 2026 — Webathon", issuer: "SNS College of Technology", date: "12–13 March 2026", category: "Web", description: "Certificate of appreciation for participation in the Webathon event at TEXPERIA 2026.", image: "/certificates/texperia-webathon.jpg", file: "/certificates/texperia-webathon.jpg", credential: "" },
  { id: "nexora", title: "NEXORA 2K26 — Web Development", issuer: "PGP College of Engineering and Technology", date: "", category: "Web", description: "Participated in the Web Development event at NEXORA 2K26, a national-level technical symposium organised by the Department of Computer Science and Engineering. The certificate states 20 February; the year awaits confirmation.", image: "/certificates/nexora-web-development.jpg", file: "/certificates/nexora-web-development.jpg", credential: "" },
  { id: "fusion", title: "FUSION X 2K25 — Code Debugging", issuer: "PGP College of Engineering and Technology", date: "30 April 2025", category: "Other", description: "Participated in Code Debugging at FUSION X 2K25, organised by the Department of Information Technology and Artificial Intelligence & Data Science.", image: "/certificates/fusion-code-debugging.jpg", file: "/certificates/fusion-code-debugging.jpg", credential: "" },
  { id: "employability", title: "Employability Hackathon", issuer: "SM Groups · Naan Mudhalvan / TNSDC", date: "", category: "Other", description: "Certificate of participation in the Employability Hackathon conducted by SM Groups, a Naan Mudhalvan training partner, organised by Tamil Nadu Skill Development Corporation.", image: "/certificates/employability-hackathon.jpg", file: "/certificates/employability-hackathon.jpg", credential: "" },
];
export function filterCertificates(items: Certificate[], category: CertificateCategory) {
  return category === "All" ? items : items.filter((item) => item.category === category);
}
