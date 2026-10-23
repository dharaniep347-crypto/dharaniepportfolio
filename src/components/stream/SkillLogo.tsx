import type { IconType } from "react-icons";
import { SiJavascript, SiReact, SiPython, SiTailwindcss, SiNodedotjs, SiExpress, SiMysql, SiMongodb, SiSpringboot, SiGit, SiGithub } from "react-icons/si";
import { FaAws, FaDatabase, FaCode } from "react-icons/fa";

const logos: Record<string, [IconType, string][]> = {
  javascript: [[SiJavascript, "javascript"]], react: [[SiReact, "react"]], python: [[SiPython, "python"]],
  tailwindcss: [[SiTailwindcss, "tailwind"]], node: [[SiNodedotjs, "node"]], express: [[SiExpress, "express"]],
  mysql: [[SiMysql, "mysql"]], mongodb: [[SiMongodb, "mongo"]], springboot: [[SiSpringboot, "spring"]],
  gitandgithub: [[SiGit, "git"], [SiGithub, "github"]], git: [[SiGit, "git"]], github: [[SiGithub, "github"]],
  aws: [[FaAws, "aws"]], sql: [[FaDatabase, "sql"]],
};

export default function SkillLogo({ name, tile = false }: { name: string; tile?: boolean }) {
  const key = name.toLowerCase().replace(/\.js/g, "").replace(/[^a-z0-9]/g, "");
  const icons = logos[key] ?? [[FaCode, "generic"]];
  return <span aria-hidden="true" className={`skill-logo ${tile ? "skill-logo-tile" : "skill-logo-inline"}`}>
    {icons.map(([Icon, colour], index) => <Icon key={index} className={`skill-brand-${colour}`} focusable="false" />)}
  </span>;
}