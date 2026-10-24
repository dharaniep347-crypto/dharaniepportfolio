import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import { education, academicStats, type EducationEntry } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function CgpaTracker({ entry }: { entry: EducationEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const stats = academicStats(entry);
  const highestSemester = stats.completed.find((s) => s.cgpa === stats.highest)?.semester;
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
      <div className="mb-6 flex flex-wrap items-center gap-5">
        <div className="relative size-28 shrink-0" role="img" aria-label={`Current CGPA ${stats.overall?.toFixed(2) ?? "unavailable"} out of 10`}>
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray={`${(stats.overall ?? 0) * 10} 100`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-heading">{stats.overall?.toFixed(2) ?? "—"}</span><span className="text-[10px] text-muted-foreground">out of 10</span><span className="mt-1 text-[10px] text-heading">Current CGPA</span></div>
        </div>
        <div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">Degree progress</p><p className="mt-1 text-sm font-semibold text-heading">Semester {entry.currentSemester} of {entry.totalSemesters}</p><progress aria-label="Degree progress" value={entry.currentSemester} max={entry.totalSemesters} className="degree-progress mt-3 h-2 w-full" /></div>
      </div>
      <h4 className="font-display font-bold text-heading">Semester CGPA <span className="text-xs font-normal text-muted-foreground">· out of 10</span></h4>
      <div className="mt-4 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="flex gap-2" aria-hidden="true">
            <div className="relative h-32 w-5 shrink-0">
              {[10, 8, 6, 4, 2, 0].map((v) => <span key={v} className="absolute right-0 translate-y-1/2 text-[9px] leading-none text-muted-foreground" style={{ bottom: `${v * 10}%` }}>{v}</span>)}
            </div>
            <div className="relative flex min-w-0 flex-1 gap-1 sm:gap-2">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32">
                {[10, 8, 6, 4, 2].map((v) => <div key={v} className="absolute inset-x-0 border-t border-dashed border-border" style={{ bottom: `${v * 10}%` }} />)}
                <div className="absolute inset-x-0 bottom-0 border-b border-border" />
              </div>
              {(entry.semesters ?? []).map((s) => (
                <div key={s.semester} className="flex min-w-0 flex-1 flex-col items-center">
                  <div className="relative flex h-32 w-full max-w-8 items-end sm:max-w-10">
                    {s.cgpa === null ? <div className="flex h-full w-full items-center justify-center rounded-t-sm border border-dashed border-border"><span className="text-[9px] leading-tight text-muted-foreground sm:text-[10px]">In progress</span></div> : <div data-semester={s.semester} className={`cgpa-bar relative w-full origin-bottom rounded-t-sm ${s.semester === highestSemester ? "bg-primary" : "bg-academic-bar"} ${visible ? "cgpa-visible" : ""}`} style={{ height: `${Math.max(0, Math.min(10, s.cgpa)) * 10}%` }}><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-heading sm:text-xs">{s.cgpa.toFixed(2)}</span></div>}
                  </div>
                  <span className="mt-2 whitespace-nowrap pb-2 text-[10px] text-muted-foreground sm:text-xs">Sem {s.semester}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="sr-only">
            Semester CGPA out of 10: {stats.completed.map((s) => `Semester ${s.semester}, ${s.cgpa.toFixed(2)} out of 10`).join("; ")}. Overall CGPA {stats.overall?.toFixed(2)} out of 10.
          </p>
        </div>
        <dl className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {[["Overall CGPA", stats.overall?.toFixed(2)], ["Highest semester", `${stats.highest?.toFixed(2)} (Sem ${highestSemester})`], ["Semesters completed", `${stats.count} of ${entry.totalSemesters}`]].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-md bg-chip p-3">
              <dt className="text-[10px] text-muted-foreground sm:text-xs">{label}</dt>
              <dd className="mt-1 text-sm font-bold text-heading">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Education() {
  const [selected, setSelected] = useState<EducationEntry | null>(null);
  return (
    <><section id="education" aria-labelledby="education-title" className="mx-auto max-w-7xl scroll-mt-24 px-5">
      <h2 id="education-title" className="font-display text-lg font-extrabold text-heading md:text-xl">Education</h2>
      <ol className="relative mt-5 space-y-5 border-l border-border pl-5 sm:pl-7">
        {education.map((entry) => (
          <li key={entry.id} className="relative min-w-0">
            <span aria-hidden="true" className="absolute -left-[27px] top-7 size-3 rounded-full bg-primary sm:-left-[35px]" />
            <Button asChild variant="ghost" className="block h-auto w-full min-w-0 whitespace-normal rounded-md border border-border bg-card p-4 text-left font-normal hover:bg-card sm:p-6" onClick={() => setSelected(entry)}>
            <button type="button" aria-label={`Open ${entry.qualification} education details`}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-display text-base font-extrabold leading-snug sm:text-lg">{entry.qualification}</h3>
                  {entry.semesters && <p className="mt-2 text-sm text-muted-foreground">{entry.institution}</p>}
                </div>
                <GraduationCap className="size-6 shrink-0 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {!entry.semesters && <span className="min-w-0 rounded-sm bg-chip px-2 py-1 text-heading">{entry.institution}</span>}
                <span className="rounded-sm bg-chip px-2 py-1 text-heading">{entry.years}</span>
                {entry.board && <span className="min-w-0 rounded-sm bg-chip px-2 py-1 text-heading">Board: {entry.board}</span>}
                {entry.score && <span className="rounded-sm bg-chip px-2 py-1 text-heading">Score: {entry.score}</span>}
                <span className="rounded-sm bg-chip px-2 py-1 text-heading">Status: {entry.status}</span>
              </div>
              {entry.expectedGraduation && <p className="mt-3 text-sm text-muted-foreground">Expected graduation: {entry.expectedGraduation}</p>}
              {!entry.semesters && <div className="mt-3 space-y-2 text-xs text-muted-foreground">{entry.group && <p>Group: {entry.group}</p>}{entry.medium && <p>Medium: {entry.medium}</p>}</div>}
              {entry.semesters && <CgpaTracker entry={entry} />}
            </button>
            </Button>
          </li>
        ))}
      </ol>
    </section>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      {selected && <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-3xl flex-col gap-0 overflow-hidden rounded-md border-border p-0 [&>button]:right-3 [&>button]:top-3 [&>button]:z-20 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center [&>button]:bg-raised [&>button]:text-heading [&>button]:opacity-100">
        <div className="min-w-0 overflow-y-auto overscroll-contain p-5 pt-16 sm:p-8 sm:pt-16">
          <DialogTitle className="break-words font-display text-xl font-extrabold leading-snug tracking-normal">{selected.qualification}</DialogTitle>
          <DialogDescription className="mt-3 break-words">{selected.institution} · {selected.years}</DialogDescription>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-heading">
            {[selected.board, selected.score, selected.status, selected.medium ? `${selected.medium} medium` : ""].filter(Boolean).map((value) => <span key={value} className="min-w-0 rounded-sm bg-chip px-2 py-1">{value}</span>)}
          </div>
          {selected.group && <p className="mt-4 text-sm text-muted-foreground">Group: {selected.group}</p>}
          {selected.expectedGraduation && <p className="mt-4 text-sm text-muted-foreground">Expected graduation: {selected.expectedGraduation}</p>}
          {selected.semesters && <CgpaTracker entry={selected} />}
          {selected.subjects && <div className="mt-6">
            <h4 className="font-display font-bold text-heading">Subject-wise marks</h4>
            <p className="mt-1 text-xs text-muted-foreground">{selected.marksBasis}</p>
            <ul className="mt-5 space-y-5">
              {selected.subjects.map(({ subject, marks }) => <li key={subject} className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-heading">
                  <span>{subject}</span>
                  {subject === selected.topSubject && <span className="rounded-sm bg-chip px-2 py-1 text-[10px] font-semibold text-primary">Top score</span>}
                  <span className="ml-auto shrink-0 font-semibold">{marks} / 100</span>
                </div>
                <progress className="degree-progress block h-1 w-full" aria-label={`${subject} marks out of 100`} value={marks} max={100} />
              </li>)}
            </ul>
          </div>}
        </div>
      </DialogContent>}
    </Dialog></>
  );
}