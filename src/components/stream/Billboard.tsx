import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Play, Info, Download } from "lucide-react";
import type { SiteContent } from "@/lib/content";
import ExternalLink from "./ExternalLink";

const HeroScene = lazy(() => import("@/components/HeroScene"));

class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? null : this.props.children; }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export default function Billboard({
  content,
  with3D,
  onMoreInfo,
}: {
  content: SiteContent;
  with3D: boolean;
  onMoreInfo: () => void;
}) {
  const [gl, setGl] = useState(false);
  useEffect(() => { setGl(hasWebGL()); }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* 3D scene, right side (Explorer profile only) */}
      {with3D && (
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden>
          <ClientOnly fallback={null}>
            {gl ? (
              <GLBoundary>
                <Suspense fallback={null}><HeroScene /></Suspense>
              </GLBoundary>
            ) : null}
          </ClientOnly>
        </div>
      )}
      {/* Left fade over the scene */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#07091a] via-[#07091a]/80 to-transparent" />
      {/* Bottom fade into the page */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07091a] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-32 pt-28">
        <h1 className="font-wide leading-[0.9]" style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}>
          {content.profile.name}
        </h1>
        <p className="mt-3 font-display text-xl font-extrabold text-[#ffd23f] md:text-2xl">
          {content.profile.title}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {["Third-year B.Tech AI and Data Science", "Karur, India", "2026"].map((chip) => (
            <li key={chip} className="rounded-full border border-[#232a52] bg-[#11152e]/80 px-3 py-1 text-xs font-semibold text-[#c6cbe8]">
              {chip}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-md text-lg leading-snug text-[#c6cbe8]">
          I build AI-powered full-stack web apps with React, Spring Boot and Node.js.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={scrollToProjects}
            className="flex items-center gap-2 rounded-md bg-[#f3f4fb] px-7 py-3 text-lg font-bold text-[#07091a] transition-colors hover:bg-[#f3f4fb]/75"
          >
            <Play className="size-6 fill-current" aria-hidden /> Play projects
          </button>
          <button
            onClick={onMoreInfo}
            className="flex items-center gap-2 rounded-md bg-[#6d7194]/40 px-6 py-3 text-lg font-bold text-[#f3f4fb] backdrop-blur transition-colors hover:bg-[#6d7194]/60"
          >
            <Info className="size-6" aria-hidden /> More info
          </button>
          <ExternalLink
            href={content.profile.resume}
            download
            aria-label="Download resume"
            className="rounded-full border-2 border-[#9aa0c3]/50 p-3 text-[#f3f4fb] transition-colors hover:border-[#f3f4fb]"
          >
            <Download className="size-5" aria-hidden />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
