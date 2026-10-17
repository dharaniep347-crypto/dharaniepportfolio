import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, GraduationCap, ArrowRight, Download } from "lucide-react";
import { z } from "zod";
import {
  profile,
  skills,
  skillCategories,
  projects,
  type Project,
} from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const title = `${profile.name} | ${profile.title}`;
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: profile.bio },
      { property: "og:title", content: title },
      { property: "og:description", content: profile.bio },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.title,
          email: `mailto:${profile.email}`,
          telephone: profile.phone,
          address: { "@type": "PostalAddress", addressLocality: "Karur", addressRegion: "Tamil Nadu", addressCountry: "IN" },
          alumniOf: "PGP College of Engineering and Technology",
          sameAs: [profile.linkedin, profile.github],
        }),
      },
    ],
  }),
  component: Index,
});

class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

const nav = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
] as const;

function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-wide text-lg">D<span className="text-primary">.</span>EP</a>
          <ul className="flex gap-4 text-sm font-semibold sm:gap-7">
            {nav.map(([l, h]) => (
              <li key={h}><a href={h} className="hover:text-primary">{l}</a></li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-wide text-xl">{profile.name}</p>
          <div className="flex gap-5 text-sm">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-signal">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-signal">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="hover:text-signal">Email</a>
          </div>
          <p className="text-sm opacity-70">© {new Date().getFullYear()} {profile.name}</p>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-6 px-5 pb-16 pt-12 md:grid-cols-[1.2fr_1fr] md:pt-20">
      <div>
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">{profile.title}</p>
        <h1 className="font-wide leading-[0.88]" style={{ fontSize: "clamp(3rem, 10vw, 9rem)" }}>
          {profile.nameLines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          className="mt-4 h-3 w-48 origin-left bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <p className="mt-6 max-w-md text-lg text-muted-foreground">{profile.bio}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><a href="#projects">See my projects <ArrowRight /></a></Button>
          <Button asChild size="lg" variant="outline"><a href={profile.resume} download><Download /> Download resume</a></Button>
          <Button asChild size="lg" variant="ghost"><a href="#contact">Get in touch</a></Button>
        </div>
        <div className="mt-6 flex gap-3">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="rounded-md border p-2 hover:bg-accent"><Github className="size-5" /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="rounded-md border p-2 hover:bg-accent"><Linkedin className="size-5" /></a>
        </div>
      </div>
      <div className="h-[360px] md:h-[520px]">
        <ClientOnly fallback={null}>
          {hasWebGL() ? (
            <GLBoundary>
              <Suspense fallback={null}><HeroScene /></Suspense>
            </GLBoundary>
          ) : null}
        </ClientOnly>
      </div>
    </section>
  );
}

function SectionTitle({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-wide text-sm text-primary">{n}</span>
      <h2 className="font-wide text-4xl md:text-6xl">{children}</h2>
    </div>
  );
}

function About() {
  const facts = [
    [MapPin, "Location", profile.location],
    [Mail, "Email", profile.email],
    [Phone, "Phone", profile.phone],
    [GraduationCap, "Education", profile.education],
  ] as const;
  return (
    <section id="about" className="scroll-mt-20 border-t py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle n="01">About</SectionTitle>
        <div className="grid gap-10 md:grid-cols-[320px_1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ink">
            {profile.portrait ? (
              <img src={profile.portrait} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover object-center" />
            ) : (
              <div className="flex h-full items-center justify-center font-wide text-8xl text-signal" role="img" aria-label={`${profile.name} initials`}>DEP</div>
            )}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-accent" />
          </div>
          <div>
            {profile.about.map((p) => <p key={p.slice(0, 20)} className="mb-5 text-lg leading-relaxed">{p}</p>)}
            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {facts.map(([Icon, k, v]) => (
                <div key={k} className="flex gap-3 border-l-4 border-primary pl-3">
                  <Icon className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                  <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="text-sm">{v}</dd></div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chips<T extends string>({ items, value, onChange, label }: { items: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="mb-8 flex flex-wrap gap-2">
      {items.map((c) => (
        <button
          key={c}
          aria-pressed={value === c}
          onClick={() => onChange(c)}
          className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${value === c ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"}`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function Skills() {
  const [cat, setCat] = useState<"All" | (typeof skillCategories)[number]>("All");
  const list = skills.filter((s) => cat === "All" || s.category === cat);
  return (
    <section id="skills" className="scroll-mt-20 border-t bg-card py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle n="02">Skills</SectionTitle>
        <Chips label="Filter skills" items={["All", ...skillCategories] as const} value={cat} onChange={setCat} />
        <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {list.map((s) => (
            <li key={s.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-bold">{s.name} <span className="font-normal text-muted-foreground">· {s.category}</span></span>
                <span className="font-mono">{s.level}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={s.name}>
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Projects() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"All" | "AI" | "Web">("All");
  const [open, setOpen] = useState<Project | null>(null);
  const list = useMemo(() => {
    const t = q.toLowerCase();
    return projects.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (p.title + p.summary + p.tags.join(" ")).toLowerCase().includes(t),
    );
  }, [q, cat]);
  return (
    <section id="projects" className="scroll-mt-20 border-t py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle n="03">Projects</SectionTitle>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <Chips label="Filter projects" items={["All", "AI", "Web"] as const} value={cat} onChange={setCat} />
          <label className="mb-8 block md:w-72">
            <span className="sr-only">Search projects</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="w-full rounded-md border-2 bg-card px-3 py-2 text-sm" />
          </label>
        </div>
        <ul className="border-t-2 border-ink">
          {list.map((p, i) => (
            <li key={p.title} className="border-b">
              <button onClick={() => setOpen(p)} className="group grid w-full gap-2 py-6 text-left transition-transform duration-300 hover:translate-x-3 md:grid-cols-[3rem_1fr_auto] md:items-center">
                <span className="font-wide text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-xl font-extrabold group-hover:text-primary md:text-2xl">{p.title}</span>
                  <span className="block text-muted-foreground">{p.summary}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider">{p.tags.join(" · ")}</span>
                </span>
                <span className="w-fit rounded-sm bg-accent px-2 py-0.5 text-xs font-bold">{p.category}</span>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="py-6 text-muted-foreground">No projects match your search.</li>}
        </ul>
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{open.title}</DialogTitle>
                <DialogDescription>{open.description}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                {open.tags.map((t) => <span key={t} className="rounded-sm bg-muted px-2 py-1 text-xs font-semibold">{t}</span>)}
              </div>
              {(open.demo || open.source) && (
                <div className="flex gap-3">
                  {open.demo && <Button asChild><a href={open.demo} target="_blank" rel="noreferrer">Live demo</a></Button>}
                  {open.source && <Button asChild variant="outline"><a href={open.source} target="_blank" rel="noreferrer">Source</a></Button>}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Add a subject").max(150),
  message: z.string().trim().min(10, "Write at least 10 characters").max(2000),
});
type Fields = z.infer<typeof schema>;

function Contact() {
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot
    const r = schema.safeParse(Object.fromEntries(fd));
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as keyof Fields] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
    e.currentTarget.reset();
  };
  const field = (name: keyof Fields, label: string, type = "text") => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-bold">{label}</label>
      {name === "message" ? (
        <textarea id={name} name={name} rows={5} aria-invalid={!!errors[name]} aria-describedby={`${name}-err`} className="w-full rounded-md border-2 bg-card px-3 py-2 aria-[invalid=true]:border-destructive" />
      ) : (
        <input id={name} name={name} type={type} aria-invalid={!!errors[name]} aria-describedby={`${name}-err`} className="w-full rounded-md border-2 bg-card px-3 py-2 aria-[invalid=true]:border-destructive" />
      )}
      <p id={`${name}-err`} className="mt-1 min-h-5 text-sm text-destructive">{errors[name]}</p>
    </div>
  );
  return (
    <section id="contact" className="scroll-mt-20 border-t bg-card py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2">
        <div>
          <SectionTitle n="04">Contact</SectionTitle>
          <p className="text-lg text-muted-foreground">Have a project, internship or idea? Send me a message.</p>
          <a href={`mailto:${profile.email}`} className="mt-6 inline-block font-display text-xl font-extrabold underline decoration-accent decoration-4 underline-offset-4">{profile.email}</a>
        </div>
        <form onSubmit={onSubmit} noValidate className="space-y-2">
          <div className="grid gap-x-4 sm:grid-cols-2">
            {field("name", "Name")}
            {field("email", "Email", "email")}
          </div>
          {field("subject", "Subject")}
          {field("message", "Message")}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <Button type="submit" size="lg">Send message</Button>
          {sent && <p role="status" className="mt-3 rounded-md bg-accent px-3 py-2 text-sm font-semibold">Thanks! Your message is ready. I'll get back to you soon.</p>}
        </form>
      </div>
    </section>
  );
}
