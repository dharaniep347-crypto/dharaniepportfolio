import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ViewerProfile = "recruiter" | "developer" | "collaborator" | "explorer";

export const viewerProfiles: { id: ViewerProfile; label: string; gradient: string; icon: string }[] = [
  { id: "recruiter", label: "Recruiter", gradient: "var(--profile-1)", icon: "briefcase" },
  { id: "developer", label: "Developer", gradient: "var(--profile-2)", icon: "code" },
  { id: "collaborator", label: "Collaborator", gradient: "var(--profile-3)", icon: "users" },
  { id: "explorer", label: "Explorer", gradient: "var(--profile-4)", icon: "compass" },
];

/** Row order per viewer profile. */
export const profileRows: Record<ViewerProfile, string[]> = {
  recruiter: ["summary", "education", "journey", "top10", "projects", "certificates", "contact"],
  developer: ["projects", "top10", "techstack", "education", "journey", "certificates", "contact"],
  collaborator: ["projects", "learning", "education", "certificates", "contact", "top10"],
  explorer: ["summary", "projects", "top10", "techstack", "education", "journey", "certificates", "contact"],
};

const PROFILE_KEY = "pf-viewer-profile";
const MYLIST_KEY = "pf-my-list";

type Ctx = {
  profile: ViewerProfile | null;
  pickProfile: (p: ViewerProfile) => void;
  switchProfile: () => void;
  myList: string[];
  toggleMyList: (id: string) => void;
  hydrated: boolean;
};

const ViewerCtx = createContext<Ctx | null>(null);

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ViewerProfile | null>(null);
  const [myList, setMyList] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PROFILE_KEY);
      if (p && viewerProfiles.some((v) => v.id === p)) setProfile(p as ViewerProfile);
      const list = JSON.parse(localStorage.getItem(MYLIST_KEY) || "[]");
      if (Array.isArray(list)) setMyList(list.filter((x) => typeof x === "string"));
    } catch { /* storage unavailable */ }
    setHydrated(true);
  }, []);

  const pickProfile = (p: ViewerProfile) => {
    setProfile(p);
    try { localStorage.setItem(PROFILE_KEY, p); } catch { /* ignore */ }
  };
  const switchProfile = () => {
    setProfile(null);
    try { localStorage.removeItem(PROFILE_KEY); } catch { /* ignore */ }
  };
  const toggleMyList = (id: string) => {
    setMyList((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(MYLIST_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <ViewerCtx.Provider value={{ profile, pickProfile, switchProfile, myList, toggleMyList, hydrated }}>
      {children}
    </ViewerCtx.Provider>
  );
}

export function useViewer() {
  const ctx = useContext(ViewerCtx);
  if (!ctx) throw new Error("useViewer must be used inside ViewerProvider");
  return ctx;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
