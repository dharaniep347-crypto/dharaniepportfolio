import { useEffect, useRef } from "react";
import { X, Play, Plus, Check, Github, Mail, Phone, Linkedin } from "lucide-react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import type { SiteProject } from "@/lib/content";
import { ProjectCover } from "./covers";
import { useViewer } from "./state";
import Portrait from "./Portrait";
import ExternalLink from "./ExternalLink";
import { phoneHref } from "@/lib/external-url";

export type ModalItem =
  | { kind: "project"; project: SiteProject; index: number }
  | { kind: "about" };

export default function DetailModal({
  item,
  content,
  onClose,
  onOpenProject,
}: {
  item: ModalItem;
  content: import("@/lib/content").SiteContent;
  onClose: () => void;
  onOpenProject: (p: SiteProject, index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { myList, toggleMyList } = useViewer();

  // Esc + focus trap
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const root = ref.current;
    root?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && root) {
        const focusables = Array.from(root.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  const p = item.kind === "project" ? item.project : null;
  const inList = p ? myList.includes(p.id) : false;
  const others = p ? content.projects.filter((x) => x.id !== p.id).slice(0, 3) : [];

  return (
    <div
      className={p
        ? "fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
        : "fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-ink/70 p-4 backdrop-blur-sm"}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={p ? p.title : "About"}
    >
      <div ref={ref} className={p
        ? "relative my-4 max-h-[calc(100dvh-4rem)] w-full min-w-0 max-w-[880px] overflow-y-auto overflow-x-hidden rounded-md bg-card shadow-2xl sm:my-8 sm:max-h-[calc(100dvh-6rem)]"
        : "relative mx-auto box-border flex max-h-[90dvh] w-[calc(100vw-2rem)] min-w-0 max-w-3xl flex-col overflow-hidden rounded-md bg-card shadow-2xl"}>
        {p ? <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-[#07091a]/80 p-2 text-[#f3f4fb] transition-colors hover:bg-[#07091a]"
        >
          <X className="size-5" aria-hidden />
        </button>
        : <Button
            onClick={onClose}
            aria-label="Close"
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 z-50 size-11 shrink-0 rounded-full border border-border bg-background text-foreground hover:bg-secondary"
          >
            <X className="size-5" aria-hidden />
          </Button>}

        {!p ? (
          <div className="min-h-0 overflow-y-auto overscroll-contain p-4 pt-16 md:p-8 md:pt-16">
            <div className="grid min-w-0 grid-cols-1 items-center gap-6 text-center md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 md:text-left">
              {content.profile.portrait && (
                <Portrait
                  src={content.profile.portrait}
                  alt={`Portrait of ${content.profile.name}`}
                  className="mx-auto size-40 md:mx-0 md:size-[220px]"
                />
              )}
              <div className="min-w-0 space-y-5">
                <div>
                  <h2 className="font-wide break-words text-2xl sm:text-3xl md:text-4xl">{content.profile.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{content.profile.title}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                  <Button asChild variant="secondary"><ExternalLink href={`mailto:${content.profile.email}`}><Mail aria-hidden /> Email</ExternalLink></Button>
                  <Button asChild variant="outline"><ExternalLink href={phoneHref(content.profile.phone)}><Phone aria-hidden /> Call</ExternalLink></Button>
                  {content.profile.linkedin && <Button asChild variant="outline"><ExternalLink href={content.profile.linkedin}><Linkedin aria-hidden /> LinkedIn</ExternalLink></Button>}
                  {content.profile.github && <Button asChild variant="outline"><ExternalLink href={content.profile.github}><Github aria-hidden /> GitHub</ExternalLink></Button>}
                </div>
              </div>
              <div className="min-w-0 space-y-4 text-sm leading-relaxed text-foreground md:col-span-2">
                {content.profile.about.map((para) => <p key={para}>{para}</p>)}
                <p className="text-muted-foreground">{content.profile.education}</p>
                <p className="text-muted-foreground">{content.profile.location}</p>
              </div>
            </div>
          </div>
        ) : <>
        {/* Cover */}
        {p ? (
          p?.image ? (
            <img src={p?.image} alt={`${p?.title} screenshot`} className="aspect-video w-full rounded-t-md object-cover" />
          ) : (
            <ProjectCover index={(item.kind === "project" ? item.index : 0)} title={p?.title} className="aspect-video w-full rounded-t-md" iconClass="size-40" />
          )
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-md bg-[#07091a]">
            {content.profile.portrait && (
              <img src={content.profile.portrait} alt={`Portrait of ${content.profile.name}`} className="h-full w-full object-cover object-top opacity-90" />
            )}
          </div>
        )}
        <div aria-hidden className="-mt-24 h-24 bg-gradient-to-t from-[#11152e] to-transparent" />

        <div className="px-6 pb-8 md:px-10">
          <h2 className="font-wide break-words text-2xl sm:text-3xl md:text-4xl">{p ? p.title : content.profile.name}</h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {p?.demo && (
              <Button asChild variant="secondary"><ExternalLink href={p.demo}><Play aria-hidden /> Live demo</ExternalLink></Button>
            )}
            {p?.source && (
              <Button asChild variant="outline"><ExternalLink href={p.source}><Github aria-hidden /> Source code</ExternalLink></Button>
            )}
            {p && (
              <button
                onClick={() => toggleMyList(p.id)}
                aria-label={inList ? "Remove from My List" : "Add to My List"}
                className="rounded-full border-2 border-[#9aa0c3]/50 p-2.5 text-[#f3f4fb] transition-colors hover:border-[#f3f4fb]"
              >
                {inList ? <Check className="size-5" aria-hidden /> : <Plus className="size-5" aria-hidden />}
              </button>
            )}
            <span className="text-sm text-muted-foreground">
              {p ? `${p.category} · ${p?.tags.join(" · ")}` : content.profile.title}
            </span>
          </div>

          <div className="mt-6 grid min-w-0 gap-8 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              {p ? (
                <div
                  className="space-y-2 text-sm leading-relaxed text-[#c6cbe8] [&_a]:text-[#2b3bff] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-3 [&_h3]:pt-3 [&_h3]:font-bold"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p.description) }}
                />
              ) : (
                <>
                  {content.profile.about.map((para) => (
                    <p key={para.slice(0, 20)} className="mb-4 text-sm leading-relaxed text-[#c6cbe8]">{para}</p>
                  ))}
                  <p className="text-sm text-muted-foreground">{content.profile.education}</p>
                </>
              )}
            </div>
            <dl className="space-y-3 text-sm">
              {p ? (
                <>
                  <div><dt className="inline font-bold text-muted-foreground">Tech: </dt><dd className="inline">{p?.tags.join(", ")}</dd></div>
                  <div><dt className="inline font-bold text-muted-foreground">Category: </dt><dd className="inline">{p?.category}</dd></div>
                  <div><dt className="inline font-bold text-muted-foreground">Status: </dt><dd className="inline">Completed</dd></div>
                </>
              ) : (
                <>
                  <div><dt className="inline font-bold text-muted-foreground">Location: </dt><dd className="inline">{content.profile.location}</dd></div>
                  <div><dt className="inline font-bold text-muted-foreground">Email: </dt><dd className="inline break-all">{content.profile.email}</dd></div>
                  <div><dt className="inline font-bold text-muted-foreground">Phone: </dt><dd className="inline">{content.profile.phone}</dd></div>
                </>
              )}
            </dl>
          </div>

          {others.length > 0 && (
            <>
              <h3 className="font-display mt-8 text-lg font-extrabold">More like this</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {others.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => onOpenProject(o, content.projects.indexOf(o))}
                    className="overflow-hidden rounded-md border border-[#232a52] bg-[#1a1f42] text-left transition-colors hover:border-[#2b3bff]"
                  >
                    <ProjectCover index={content.projects.indexOf(o)} title={o.title} className="aspect-video w-full" iconClass="size-14" />
                    <span className="block p-3 text-xs text-muted-foreground">{o.summary}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        </>}
      </div>
    </div>
  );
}
