import { useEffect, useRef } from "react";
import { X, Play, Plus, Check } from "lucide-react";
import DOMPurify from "dompurify";
import type { SiteProject } from "@/lib/content";
import { ProjectCover } from "./covers";
import { useViewer } from "./state";

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
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
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

  const isProject = item.kind === "project";
  const p = isProject ? item.project : null;
  const inList = p ? myList.includes(p.id) : false;
  const others = isProject
    ? content.projects.filter((x) => x.id !== p!.id).slice(0, 3)
    : [];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={isProject ? p!.title : "About"}
    >
      <div ref={ref} className="relative my-8 w-full max-w-[880px] rounded-md bg-[#11152e] shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-[#07091a]/80 p-2 text-[#f3f4fb] transition-colors hover:bg-[#07091a]"
        >
          <X className="size-5" aria-hidden />
        </button>

        {/* Cover */}
        {isProject ? (
          p!.image ? (
            <img src={p!.image} alt={`${p!.title} screenshot`} className="aspect-video w-full rounded-t-md object-cover" />
          ) : (
            <ProjectCover index={item.index} title={p!.title} className="aspect-video w-full rounded-t-md" iconClass="size-40" />
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
          <h2 className="font-wide text-3xl md:text-4xl">{isProject ? p!.title : content.profile.name}</h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isProject && (p!.demo || p!.source) && (
              <a
                href={p!.demo || p!.source}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md bg-[#f3f4fb] px-5 py-2 font-bold text-[#07091a] transition-colors hover:bg-[#f3f4fb]/80"
              >
                <Play className="size-5 fill-current" aria-hidden /> Open
              </a>
            )}
            {isProject && (
              <button
                onClick={() => toggleMyList(p!.id)}
                aria-label={inList ? "Remove from My List" : "Add to My List"}
                className="rounded-full border-2 border-[#9aa0c3]/50 p-2.5 text-[#f3f4fb] transition-colors hover:border-[#f3f4fb]"
              >
                {inList ? <Check className="size-5" aria-hidden /> : <Plus className="size-5" aria-hidden />}
              </button>
            )}
            <span className="text-sm text-muted-foreground">
              {isProject ? `${p!.category} · ${p!.tags.join(" · ")}` : content.profile.title}
            </span>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_220px]">
            <div>
              {isProject ? (
                <div
                  className="space-y-2 text-sm leading-relaxed text-[#c6cbe8] [&_a]:text-[#2b3bff] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(p!.description) }}
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
              {isProject ? (
                <>
                  <div><dt className="inline font-bold text-muted-foreground">Tech: </dt><dd className="inline">{p!.tags.join(", ")}</dd></div>
                  <div><dt className="inline font-bold text-muted-foreground">Category: </dt><dd className="inline">{p!.category}</dd></div>
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
      </div>
    </div>
  );
}
