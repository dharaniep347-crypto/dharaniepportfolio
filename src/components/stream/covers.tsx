import { Plane, GraduationCap, LayoutTemplate, Droplets, type LucideIcon } from "lucide-react";

/** Generated cover artwork per project: abstract gradient + large faint icon. */
const coverStyles: { gradient: string; icon: LucideIcon }[] = [
  { gradient: "linear-gradient(135deg,#2b3bff 0%,#07091a 70%)", icon: Plane },
  { gradient: "linear-gradient(135deg,#5b21b6 0%,#07091a 70%)", icon: GraduationCap },
  { gradient: "linear-gradient(135deg,#0f766e 0%,#07091a 70%)", icon: LayoutTemplate },
  { gradient: "linear-gradient(135deg,#b98a00 0%,#07091a 70%)", icon: Droplets },
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
  const style = coverStyles[index % coverStyles.length]!;
  const Icon = style.icon;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: style.gradient }} role="img" aria-label={`${title} cover artwork`}>
      <Icon aria-hidden className={`absolute -right-4 -top-4 ${iconClass} text-[#f3f4fb]/10`} />
      <span className="absolute bottom-3 left-3 right-3 font-display text-base font-extrabold leading-tight text-[#f3f4fb] drop-shadow md:text-lg">
        {title}
      </span>
    </div>
  );
}
