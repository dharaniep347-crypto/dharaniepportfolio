import { useEffect, useRef, useState } from "react";
import { Play, Plus, Check, ChevronDown, Mail, Phone, Linkedin, Github, Download, Send, Copy } from "lucide-react";
import { toast } from "sonner";
import type { SiteContent, SiteProject } from "@/lib/content";
import { journey, skillDetails, projectCategories, filterProjects, type ProjectCategoryFilter } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import Row from "./Row";
import { ProjectCover } from "./covers";
import { useViewer, prefersReducedMotion } from "./state";

/* ---------- Featured projects (16:9 cards with hover expand) ---------- */

function FeaturedCard({
  p,
  index,
  onOpen,
}: {
  p: SiteProject;
  index: number;
  onOpen: () => void;
}) {
  const { myList, toggleMyList } = useViewer();
  const [expanded, setExpanded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const inList = myList.includes(p.id);

  const enter = () => {
    if (prefersReducedMotion()) return;
    timer.current = setTimeout(() => setExpanded(true), 300);
  };
  const leave = () => {
    if (timer.current) clearTimeout(timer.current);
    setExpanded(false);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <li
      className={`relative shrink-0 transition-transform duration-300 ${expanded ? "z-20 scale-[1.2]" : "z-0"}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        onClick={onOpen}
        onKeyDown={(e) => e.key === "Enter" && onOpen()}
        className="block w-64 overflow-hidden rounded-md border border-transparent bg-[#11152e] text-left transition-colors hover:border-[#3a4270] sm:w-72"
        aria-label={`Open ${p.title} details`}
      >
        {p.image ? (
          <img src={p.image} alt={`${p.title} screenshot`} className="aspect-video w-full object-cover" />
        ) : (
          <ProjectCover index={index} title={p.title} className="aspect-video w-full" />
        )}
        <p className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">{p.summary}</p>
      </button>
      {expanded && (
        <div className="absolute inset-x-0 top-full rounded-b-md bg-[#1a1f42] p-3 shadow-2xl">
          <div className="flex items-center gap-2">
            <button onClick={onOpen} aria-label={`Open ${p.title}`} className="rounded-full bg-[#f3f4fb] p-2 text-[#07091a] hover:bg-[#f3f4fb]/80">
              <Play className="size-4 fill-current" aria-hidden />
            </button>
            <button onClick={() => toggleMyList(p.id)} aria-label={inList ? "Remove from My List" : "Add to My List"} className="rounded-full border border-[#9aa0c3]/50 p-2 text-[#f3f4fb] hover:border-[#f3f4fb]">
              {inList ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            </button>
            <button onClick={onOpen} aria-label="More info" className="ml-auto rounded-full border border-[#9aa0c3]/50 p-2 text-[#f3f4fb] hover:border-[#f3f4fb]">
              <ChevronDown className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold text-[#ffd23f]">{p.category}</p>
          <p className="mt-1 text-xs text-muted-foreground">{p.tags.slice(0, 3).join(" · ")}</p>
        </div>
      )}
    </li>
  );
}

export function FeaturedRow({ content, onOpenProject }: { content: SiteContent; onOpenProject: (p: SiteProject, i: number) => void }) {
  const [category, setCategory] = useState<ProjectCategoryFilter>("All");
  const visible = filterProjects(content.projects, category);
  return (
    <Row id="projects" title="Featured projects" headerContent={
      <div className="flex flex-wrap gap-2" role="group" aria-label="Project categories">
        {projectCategories.map((c) => (
          <Button key={c} size="sm" variant={category === c ? "secondary" : "outline"} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</Button>
        ))}
      </div>
    }>
      {visible.map((p) => (
        <FeaturedCard key={p.id} p={p} index={content.projects.indexOf(p)} onOpen={() => onOpenProject(p, content.projects.indexOf(p))} />
      ))}
      {!visible.length && <p className="text-sm text-muted-foreground">No projects in this category.</p>}
    </Row>
  );
}

/* ---------- Top 10 skills ---------- */

export function Top10Row({ content }: { content: SiteContent }) {
  const top = [...content.skills].sort((a, b) => b.level - a.level).slice(0, 10);
  return (
    <Row id="skills" title="Top 10 skills">
      {top.map((s, i) => (
        <li key={s.name} className="flex shrink-0 items-center">
          <span aria-hidden className="rank-number -mr-6 text-[7rem] md:text-[9rem]">{i + 1}</span>
          <div className="relative flex h-56 w-36 flex-col justify-end rounded-md border border-[#232a52] bg-gradient-to-b from-[#1a1f42] to-[#11152e] p-3 md:h-64 md:w-40">
            <span className="font-display text-lg font-extrabold leading-tight">{s.name}</span>
            {skillDetails[s.name] && <span className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{skillDetails[s.name]}</span>}
            <span className="mt-1 text-sm font-bold text-[#ffd23f]">{s.level}%</span>
            <span className="mt-1 w-fit rounded-sm bg-[#07091a] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.category}</span>
          </div>
        </li>
      ))}
    </Row>
  );
}

/* ---------- Tech stack ---------- */

export function TechStackRow({ content }: { content: SiteContent }) {
  const cats = Array.from(new Set(content.skills.map((s) => s.category)));
  return (
    <Row title="Tech stack">
      {cats.map((c) => (
        <div key={c} className="w-64 shrink-0 rounded-md border border-[#232a52] bg-[#11152e] p-4">
          <h3 className="font-display text-base font-extrabold text-[#ffd23f]">{c}</h3>
          {skillDetails[c] && <p className="mt-1 text-xs text-muted-foreground">{skillDetails[c]}</p>}
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {content.skills.filter((s) => s.category === c).map((s) => (
              <li key={s.name} title={skillDetails[s.name]} className="rounded-full bg-[#1a1f42] px-2.5 py-1 text-xs font-semibold">{s.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </Row>
  );
}

/* ---------- Journey ("Continue watching") ---------- */

export function JourneyRow({ title = "Journey" }: { title?: string }) {
  return (
    <Row id="journey" title={title}>
      {journey.map((j) => (
        <div key={j.title} className="relative w-72 shrink-0 overflow-hidden rounded-md border border-[#232a52] bg-[#11152e] p-4 pb-6 sm:w-80">
          <h3 className="font-display text-base font-extrabold leading-snug">{j.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{j.subtitle}</p>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#232a52]" role="progressbar" aria-valuenow={j.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${j.title} progress`}>
            <div className="h-full bg-[#ffd23f]" style={{ width: `${j.progress}%` }} />
          </div>
        </div>
      ))}
    </Row>
  );
}

/* ---------- Profile summary ---------- */

export function SummaryRow({ content, onMoreInfo }: { content: SiteContent; onMoreInfo: () => void }) {
  return (
    <Row title="Profile summary">
      <button
        onClick={onMoreInfo}
        className="flex w-80 shrink-0 items-center gap-4 rounded-md border border-[#232a52] bg-[#11152e] p-4 text-left transition-colors hover:border-[#2b3bff] sm:w-96"
      >
        {content.profile.portrait && (
          <img src={content.profile.portrait} alt={`Portrait of ${content.profile.name}`} className="size-20 rounded-md object-cover object-top" />
        )}
        <span>
          <span className="font-display block text-lg font-extrabold">{content.profile.name}</span>
          <span className="block text-sm text-muted-foreground">{content.profile.bio}</span>
          <span className="mt-1 block text-xs font-semibold text-[#2b3bff]">More info →</span>
        </span>
      </button>
      <div className="w-72 shrink-0 rounded-md border border-[#232a52] bg-[#11152e] p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Education</h3>
        <p className="mt-2 text-sm leading-relaxed">{content.profile.education}</p>
      </div>
      <div className="w-72 shrink-0 rounded-md border border-[#232a52] bg-[#11152e] p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Based in</h3>
        <p className="mt-2 text-sm">{content.profile.location}</p>
        <h3 className="mt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Open to</h3>
        <p className="mt-2 text-sm">Internships, projects and collaborative learning.</p>
      </div>
    </Row>
  );
}

/* ---------- Contact ---------- */

export function ContactRow({ content, onMessage }: { content: SiteContent; onMessage: () => void }) {
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Couldn't copy — please copy it manually.");
    }
  };
  const cards = [
    { label: "Email", value: content.profile.email, icon: Mail, action: () => copy(content.profile.email, "Email") },
    { label: "Phone", value: content.profile.phone, icon: Phone, action: () => copy(content.profile.phone, "Phone number") },
    { label: "LinkedIn", value: "Connect with me", icon: Linkedin, href: content.profile.linkedin },
    { label: "GitHub", value: "See my code", icon: Github, href: content.profile.github },
    { label: "Resume", value: "Download PDF", icon: Download, href: content.profile.resume, download: true },
  ];
  return (
    <Row id="contact" title="Contact me">
      {cards.map((c) => {
        const Icon = c.icon;
        const inner = (
          <>
            <Icon className="size-6 text-[#ffd23f]" aria-hidden />
            <span className="mt-3 font-display block text-base font-extrabold">{c.label}</span>
            <span className="mt-0.5 block break-all text-xs text-muted-foreground">{c.value}</span>
            <Copy className="absolute right-3 top-3 size-4 text-muted-foreground" aria-hidden />
          </>
        );
        const cls = "relative block w-56 shrink-0 rounded-md border border-[#232a52] bg-[#11152e] p-4 text-left transition-colors hover:border-[#2b3bff]";
        return c.href ? (
          <a key={c.label} href={c.href} {...(c.download ? { download: true } : { target: "_blank", rel: "noreferrer" })} className={cls} aria-label={`${c.label}: ${c.value}`}>
            {inner}
          </a>
        ) : (
          <button key={c.label} onClick={c.action} className={cls} aria-label={`Copy ${c.label}`}>
            {inner}
          </button>
        );
      })}
      <button
        onClick={onMessage}
        className="flex w-56 shrink-0 flex-col items-start rounded-md border border-[#2b3bff] bg-[#2b3bff]/15 p-4 text-left transition-colors hover:bg-[#2b3bff]/30"
      >
        <Send className="size-6 text-[#f3f4fb]" aria-hidden />
        <span className="mt-3 font-display text-base font-extrabold">Send a message</span>
        <span className="mt-0.5 text-xs text-muted-foreground">Opens a contact form</span>
      </button>
    </Row>
  );
}

/* ---------- My List ---------- */

export function MyListRow({ content, onOpenProject }: { content: SiteContent; onOpenProject: (p: SiteProject, i: number) => void }) {
  const { myList } = useViewer();
  const items = content.projects.filter((p) => myList.includes(p.id));
  if (items.length === 0) return null;
  return (
    <Row title="My List">
      {items.map((p) => (
        <button
          key={p.id}
          onClick={() => onOpenProject(p, content.projects.indexOf(p))}
          className="block w-64 shrink-0 overflow-hidden rounded-md border border-transparent bg-[#11152e] text-left transition-colors hover:border-[#3a4270] sm:w-72"
        >
          <ProjectCover index={content.projects.indexOf(p)} title={p.title} className="aspect-video w-full" />
        </button>
      ))}
    </Row>
  );
}
