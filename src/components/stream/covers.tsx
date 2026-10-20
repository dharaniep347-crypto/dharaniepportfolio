import { Plane, GraduationCap, LayoutTemplate, Droplets, type LucideIcon } from "lucide-react";

/** Generated cover artwork per project: abstract gradient + large faint icon. */
const coverStyles: { gradient: string; icon: LucideIcon }[] = [
  { gradient: "var(--cover-1)", icon: Plane },
  { gradient: "var(--cover-2)", icon: GraduationCap },
  { gradient: "var(--cover-3)", icon: LayoutTemplate },
  { gradient: "var(--cover-4)", icon: Droplets },
];

export function ProjectCover({
  index,
  title,
  className = "",
  iconClass = "size-24",
}: {
  index: number;
  title: string;
  className?: string;
  iconClass?: string;
}) {
  const style = coverStyles[index % coverStyles.length] ?? coverStyles[0];
  if (!style) return null;
  const Icon = style.icon;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: style.gradient }} role="img" aria-label={`${title} cover artwork`}>
      <Icon aria-hidden className={`absolute -right-4 -top-4 ${iconClass} text-heading/10`} />
      <span className="absolute bottom-3 left-3 right-3 font-display text-base font-extrabold leading-tight text-heading drop-shadow md:text-lg">
        {title}
      </span>
    </div>
  );
}
