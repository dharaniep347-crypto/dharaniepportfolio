import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import { education, academicStats, type EducationEntry } from "@/data/portfolio";

function CgpaTracker({ entry }: { entry: EducationEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const stats = academicStats(entry);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([item]) => {
      if (item?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="mt-6 border-t border-border pt-5">
      <h4 className="font-display font-bold text-heading">Semester CGPA</h4>
      <div className="mt-4 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="flex h-40 items-end gap-2 border-b border-border" aria-hidden="true">
            {(entry.semesters ?? []).map((s) => (
              <div key={s.semester} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-heading">{s.cgpa?.toFixed(2) ?? "—"}</span>
                <div className="flex h-28 w-full max-w-10 items-end">
                  {s.cgpa === null ? <div className="h-full w-full rounded-t-sm border border-dashed border-border bg-chip" /> : <div className={`cgpa-bar w-full origin-bottom rounded-t-sm bg-primary ${visible ? "cgpa-visible" : ""}`} style={{ height: `${Math.max(0, Math.min(10, s.cgpa)) * 10}%` }} />}
                </div>
                <span className="whitespace-nowrap pb-2 text-[10px] text-muted-foreground sm:text-xs">Sem {s.semester}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {stats.completed.length ? stats.completed.map((s) => `Sem ${s.semester}: ${s.cgpa.toFixed(2)} out of 10`).join(" · ") : "Semester results have not been provided."}
          </p>
        </div>
        <dl className="grid grid-cols-3 items-start gap-2 lg:grid-cols-1">
          {[["Overall CGPA", stats.overall?.toFixed(2)], ["Highest semester", stats.highest?.toFixed(2)], ["Semesters completed", stats.count]].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-md bg-chip p-3">
              <dt className="text-[10px] text-muted-foreground sm:text-xs">{label}</dt>
              <dd className="mt-1 text-lg font-bold text-heading">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="mx-auto max-w-7xl scroll-mt-24 px-5">
      <h2 id="education-title" className="font-display text-lg font-extrabold text-heading md:text-xl">Education</h2>
      <ol className="relative mt-5 space-y-5 border-l border-border pl-5 sm:pl-7">
        {education.map((entry) => (
          <li key={entry.id} className="relative min-w-0">
            <span aria-hidden="true" className="absolute -left-[27px] top-7 size-3 rounded-full bg-primary sm:-left-[35px]" />
            <article className="rounded-md border border-border bg-card p-4 sm:p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-display text-base font-extrabold leading-snug sm:text-lg">{entry.qualification}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{entry.institution || "School details pending"}</p>
                </div>
                <GraduationCap className="size-6 shrink-0 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-muted-foreground">{entry.years || "Year not provided"}</span>
                <span className="rounded-sm bg-chip px-2 py-1 text-heading">Status: {entry.status}</span>
              </div>
              {entry.expectedGraduation && <p className="mt-3 text-sm text-muted-foreground">Expected graduation: {entry.expectedGraduation}</p>}
              {!entry.semesters && <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"><div><dt className="inline">Board: </dt><dd className="inline">{entry.board || "Not provided"}</dd></div><div><dt className="inline">Score: </dt><dd className="inline">{entry.score || "Not provided"}</dd></div>{entry.group && <div><dt className="inline">Group: </dt><dd className="inline">{entry.group}</dd></div>}</dl>}
              {entry.semesters && <CgpaTracker entry={entry} />}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}