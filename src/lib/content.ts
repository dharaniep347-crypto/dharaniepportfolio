import { profile, skills, projects } from "@/data/portfolio";

export type Skill = { name: string; level: number; category: string };
export type SiteProject = {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string; // HTML
  tags: string[];
  image: string;
  demo: string;
  source: string;
  featured: boolean;
};
export type SiteContent = {
  profile: {
    name: string;
    title: string;
    bio: string;
    about: string[];
    email: string;
    phone: string;
    location: string;
    education: string;
    github: string;
    linkedin: string;
    portrait: string;
    resume: string;
  };
  skills: Skill[];
  projects: SiteProject[];
};

export const skillCategories = ["Languages", "Frontend", "Backend", "Databases", "Cloud and Tools"];

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Content from src/data/portfolio.ts, used when the database is empty or unreachable. */
export function fallbackContent(): SiteContent {
  return {
    profile: {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      about: profile.about,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      education: profile.education,
      github: profile.github,
      linkedin: profile.linkedin,
      portrait: profile.portrait,
      resume: profile.resume,
    },
    skills,
    projects: projects.map((p, i) => ({
      id: `fallback-${i}`,
      title: p.title,
      category: p.category,
      summary: p.summary,
      description: `<p>${escape(p.description)}</p>`,
      tags: p.tags,
      image: "",
      demo: p.demo,
      source: p.source,
      featured: false,
    })),
  };
}
