import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

export const AUTO_ADVANCE_MS = 1000;
export const SCROLL_DURATION_MS = 500;
export const ROW_START_DELAY_MS = 1000;
export const ROW_VISIBILITY_THRESHOLD = 0.6;
export type RowCandidate = { id: string; ratio: number; centre: number };
export function closestVisibleRow(rows: RowCandidate[], viewportHeight: number): string | null {
  return rows.filter((row) => row.ratio >= ROW_VISIBILITY_THRESHOLD)
    .sort((a, b) => Math.abs(a.centre - viewportHeight / 2) - Math.abs(b.centre - viewportHeight / 2))[0]?.id ?? null;
}
export function canAutoAdvance(state: { active: boolean; hover: boolean; focus: boolean; interacting: boolean; paused: boolean; hidden: boolean; dialog: boolean; reduced: boolean }) {
  return state.active && !state.hover && !state.focus && !state.interacting && !state.paused && !state.hidden && !state.dialog && !state.reduced;
}

const rows = new Map<string, HTMLElement>();
const listeners = new Set<() => void>();
let active: string | null = null;
let frame = 0;
function updateActive() {
  frame = 0;
  const height = window.innerHeight;
  const candidates = [...rows].map(([id, el]) => {
    const rect = el.getBoundingClientRect();
    return { id, centre: rect.top + rect.height / 2, ratio: rect.height > 0 ? Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0)) / rect.height : 0 };
  });
  const next = closestVisibleRow(candidates, height);
  if (next !== active) { active = next; listeners.forEach((listener) => listener()); }
}
function scheduleUpdate() { if (!frame) frame = requestAnimationFrame(updateActive); }
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => active;
const serverSnapshot = () => null;

export function useRowAdvance(section: RefObject<HTMLElement | null>, key: string) {
  const activeId = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [environment, setEnvironment] = useState({ hidden: false, dialog: false, reduced: true });
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const first = rows.size === 0;
    rows.set(key, el);
    if (first) { window.addEventListener("scroll", scheduleUpdate, { passive: true }); window.addEventListener("resize", scheduleUpdate); }
    const observer = new IntersectionObserver(scheduleUpdate, { threshold: ROW_VISIBILITY_THRESHOLD });
    observer.observe(el);
    scheduleUpdate();
    return () => {
      observer.disconnect(); rows.delete(key);
      if (!rows.size) { window.removeEventListener("scroll", scheduleUpdate); window.removeEventListener("resize", scheduleUpdate); }
      scheduleUpdate();
    };
  }, [key, section]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const refresh = () => {
      const dialog = [...document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"]')].some((el) => el.getClientRects().length > 0);
      const next = { hidden: document.hidden, dialog, reduced: media.matches };
      setEnvironment((prev) => prev.hidden === next.hidden && prev.dialog === next.dialog && prev.reduced === next.reduced ? prev : next);
    };
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["role", "data-state", "hidden", "aria-hidden"] });
    document.addEventListener("visibilitychange", refresh);
    media.addEventListener("change", refresh);
    refresh();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", refresh); media.removeEventListener("change", refresh); };
  }, []);
  return { active: activeId === key, ...environment };
}