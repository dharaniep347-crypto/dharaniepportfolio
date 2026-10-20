import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { profile as staticProfile } from "@/data/portfolio";
import { getSiteContent } from "@/lib/content.functions";
import type { SiteProject } from "@/lib/content";
import { ViewerProvider, useViewer, profileRows, prefersReducedMotion } from "@/components/stream/state";
import Intro from "@/components/stream/Intro";
import ProfileGate from "@/components/stream/ProfileGate";
import Navbar from "@/components/stream/Navbar";
import Billboard from "@/components/stream/Billboard";
import DetailModal, { type ModalItem } from "@/components/stream/DetailModal";
import ContactModal from "@/components/stream/ContactModal";
import { FeaturedRow, Top10Row, TechStackRow, JourneyRow, SummaryRow, ContactRow, MyListRow } from "@/components/stream/rows";
import ExternalLink from "@/components/stream/ExternalLink";
import { normalizeExternalUrl } from "@/lib/external-url";

const contentQuery = queryOptions({ queryKey: ["site-content"], queryFn: () => getSiteContent() });
function useContent() {
  const { data } = useSuspenseQuery(contentQuery);
  return {
    ...data,
    profile: {
      ...data.profile,
      linkedin: normalizeExternalUrl(data.profile.linkedin).replace(/\/$/, ""),
      github: normalizeExternalUrl(data.profile.github).replace(/\/$/, ""),
      resume: normalizeExternalUrl(data.profile.resume),
    },
  };
}

const title = `${staticProfile.name} | ${staticProfile.title}`;
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: staticProfile.bio },
      { property: "og:title", content: title },
      { property: "og:description", content: staticProfile.bio },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: staticProfile.name,
          jobTitle: staticProfile.title,
          email: `mailto:${staticProfile.email}`,
          telephone: staticProfile.phone,
          address: { "@type": "PostalAddress", addressLocality: "Karur", addressRegion: "Tamil Nadu", addressCountry: "IN" },
          alumniOf: "PGP College of Engineering and Technology",
          sameAs: [staticProfile.linkedin, staticProfile.github],
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Index,
  errorComponent: () => <div className="p-10">This page didn't load. Please refresh.</div>,
});

const INTRO_KEY = "pf-intro-seen";

function Index() {
  return (
    <ViewerProvider>
      <Gate />
    </ViewerProvider>
  );
}

function Gate() {
  const { profile, pickProfile, hydrated } = useViewer();
  const [introDone, setIntroDone] = useState(true); // SSR-safe default: no intro until hydrated
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_KEY) === "1"; } catch { /* ignore */ }
    setIntroDone(seen || prefersReducedMotion());
    setReady(true);
  }, []);

  const finishIntro = useCallback(() => {
    setIntroDone(true);
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* ignore */ }
  }, []);

  if (!ready || !hydrated) return <div className="min-h-screen bg-page" />;
  if (!introDone) return <Intro onDone={finishIntro} />;
  if (!profile) return <ProfileGate onPick={pickProfile} />;
  return <Home />;
}

function Home() {
  const content = useContent();
  const { profile } = useViewer();
  const [modal, setModal] = useState<ModalItem | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const openProject = useCallback((p: SiteProject, i: number) => setModal({ kind: "project", project: p, index: i }), []);
  const openAbout = useCallback(() => setModal({ kind: "about" }), []);

  const order = profileRows[profile ?? "explorer"];
  const rowFor = (id: string) => {
    switch (id) {
      case "summary": return <SummaryRow key={id} content={content} onMoreInfo={openAbout} />;
      case "education": return <JourneyRow key={id} title="Journey" />;
      case "learning": return <JourneyRow key={id} title="Currently learning" />;
      case "top10": return <Top10Row key={id} content={content} />;
      case "projects": return <FeaturedRow key={id} content={content} onOpenProject={openProject} />;
      case "techstack": return <TechStackRow key={id} content={content} />;
      case "contact": return <ContactRow key={id} content={content} onMessage={() => setContactOpen(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <Navbar content={content} onOpenProject={(p) => openProject(p, content.projects.indexOf(p))} />
      <main>
        <Billboard content={content} with3D={profile === "explorer"} onMoreInfo={openAbout} />
        {/* Rows overlap the bottom 80px of the billboard */}
        <div className="relative z-20 -mt-20 space-y-10 pb-16">
          {order.map(rowFor)}
          <MyListRow content={content} onOpenProject={openProject} />
        </div>
      </main>
      <footer className="border-t border-border bg-chrome py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 text-sm text-muted-foreground sm:grid-cols-4">
          <div>
            <p className="font-wide mb-3 text-base text-heading">DHARANI</p>
            <p>© {new Date().getFullYear()} {content.profile.name}</p>
          </div>
          <ul className="space-y-2">
            <li><a href="#top" className="hover:text-heading">Home</a></li>
            <li><a href="#projects" className="hover:text-heading">Projects</a></li>
            <li><a href="#skills" className="hover:text-heading">Skills</a></li>
            <li><a href="#contact" className="hover:text-heading">Contact</a></li>
          </ul>
          <ul className="space-y-2">
            <li><ExternalLink href={content.profile.github} className="hover:text-heading">GitHub</ExternalLink></li>
            <li><ExternalLink href={content.profile.linkedin} className="hover:text-heading">LinkedIn</ExternalLink></li>
          </ul>
          <ul className="space-y-2">
            <li><ExternalLink href={content.profile.resume} download className="hover:text-heading">Resume</ExternalLink></li>
            <li><ExternalLink href={`mailto:${content.profile.email}`} className="hover:text-heading">{content.profile.email}</ExternalLink></li>
          </ul>
        </div>
      </footer>
      {modal && <DetailModal item={modal} content={content} onClose={() => setModal(null)} onOpenProject={openProject} />}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
