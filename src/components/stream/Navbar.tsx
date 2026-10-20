import { useEffect, useRef, useState } from "react";
import { Search, Menu, X, Download, Github, Linkedin, RefreshCw } from "lucide-react";
import type { SiteContent, SiteProject } from "@/lib/content";
import { skillDetails } from "@/data/portfolio";
import { useViewer, viewerProfiles } from "./state";
import Portrait from "./Portrait";
import ExternalLink from "./ExternalLink";

const links = [
  ["Home", "top"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Journey", "journey"],
  ["Contact", "contact"],
] as const;

export default function Navbar({
  content,
  onOpenProject,
}: {
  content: SiteContent;
  onOpenProject: (p: SiteProject) => void;
}) {
  const { profile, switchProfile } = useViewer();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateActive = () => setActiveSection(window.location.hash.slice(1) || "top");
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const t = q.trim().toLowerCase();
  const projectHits = t
    ? content.projects.filter((p) => [p.title, p.summary, p.category, p.description.replace(/<[^>]*>/g, " "), p.tags.join(" ")].join(" ").toLowerCase().includes(t))
    : [];
  const skillHits = t
    ? content.skills.filter((s) => [s.name, s.category, skillDetails[s.name] ?? "", skillDetails[s.category] ?? ""].join(" ").toLowerCase().includes(t))
    : [];
  const avatar = viewerProfiles.find((v) => v.id === profile);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || searchOpen ? "bg-chrome backdrop-blur" : "bg-gradient-to-b from-chrome/70 to-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3">
        <a href="#top" className="font-wide text-xl tracking-wide text-primary">
          DHARANI
        </a>
        <ul className="hidden items-center gap-5 text-sm font-medium text-foreground md:flex">
          {links.map(([l, h]) => (
            <li key={h}>
              <a href={`#${h}`} aria-current={activeSection === h ? "location" : undefined} className="nav-link transition-colors hover:text-heading">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {/* Expanding search */}
          <div className="flex items-center">
            {searchOpen && (
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && (setSearchOpen(false), setQ(""))}
                placeholder="Search projects and skills"
                aria-label="Search projects and skills"
                className="w-32 rounded-l-md border border-r-0 border-border bg-input text-heading px-3 py-1.5 text-sm min-[400px]:w-48 sm:w-64"
              />
            )}
            <button
              onClick={() => (searchOpen ? (setSearchOpen(false), setQ("")) : setSearchOpen(true))}
              aria-label={searchOpen ? "Close search" : "Open search"}
              className={`rounded-md p-2 text-foreground transition-colors hover:text-heading ${searchOpen ? "rounded-l-none border border-l-0 border-border bg-background" : ""}`}
            >
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
          </div>

          {/* Avatar menu */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              aria-label="Profile menu"
              aria-expanded={avatarOpen}
              className="block rounded-full"
            >
              {content.profile.portrait ? (
                <Portrait src={content.profile.portrait} alt="" className="size-8" />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-heading" style={{ background: avatar?.gradient }}>
                  {avatar?.label[0] ?? "D"}
                </span>
              )}
            </button>
            {avatarOpen && (
              <div className="absolute right-0 top-11 w-52 rounded-md border border-border bg-raised py-1 text-sm shadow-xl" role="menu">
                <button onClick={() => { switchProfile(); setAvatarOpen(false); }} className="flex w-full items-center gap-2 px-4 py-2 hover:bg-card" role="menuitem">
                  <RefreshCw className="size-4" aria-hidden /> Switch profile
                </button>
                <ExternalLink href={content.profile.resume} download className="flex items-center gap-2 px-4 py-2 hover:bg-card" role="menuitem">
                  <Download className="size-4" aria-hidden /> Download resume
                </ExternalLink>
                <ExternalLink href={content.profile.github} className="flex items-center gap-2 px-4 py-2 hover:bg-card" role="menuitem">
                  <Github className="size-4" aria-hidden /> GitHub
                </ExternalLink>
                <ExternalLink href={content.profile.linkedin} className="flex items-center gap-2 px-4 py-2 hover:bg-card" role="menuitem">
                  <Linkedin className="size-4" aria-hidden /> LinkedIn
                </ExternalLink>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen} className="rounded-md p-2 text-foreground md:hidden">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="border-t border-border bg-background px-5 py-3 text-sm font-medium md:hidden">
          {links.map(([l, h]) => (
            <li key={h}>
              <a href={`#${h}`} aria-current={activeSection === h ? "location" : undefined} onClick={() => setMenuOpen(false)} className="nav-link block py-2.5 text-foreground hover:text-heading">
                {l}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Search results overlay */}
      {searchOpen && t && (
        <div className="absolute inset-x-0 top-full max-h-[70vh] overflow-y-auto border-t border-border bg-chrome/98 px-5 py-6 backdrop-blur" role="region" aria-label="Search results">
          <div className="mx-auto max-w-7xl">
            {projectHits.length + skillHits.length === 0 && (
              <p className="text-sm text-muted-foreground">No results for “{q}”.</p>
            )}
            {projectHits.length > 0 && (
              <>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Projects</h2>
                <ul className="mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {projectHits.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => { onOpenProject(p); setSearchOpen(false); setQ(""); }}
                        className="w-full rounded-md border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary"
                      >
                        <span className="block font-bold">{p.title}</span>
                        <span className="block text-sm text-muted-foreground">{p.summary}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {skillHits.length > 0 && (
              <>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Skills</h2>
                <ul className="flex flex-wrap gap-2">
                  {skillHits.map((s) => (
                    <li key={s.name} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">
                      {s.name} <span className="text-heading">{s.level}%</span>
                      {skillDetails[s.name] && <span className="block text-xs text-muted-foreground">{skillDetails[s.name]}</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
