import { Children, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTO_ADVANCE_MS, ROW_START_DELAY_MS, SCROLL_DURATION_MS, canAutoAdvance, useRowAdvance } from "./row-advance";

/** Horizontally scrolling row with snap, hover arrows and an "Explore all" link. */
export default function Row({
  id,
  title,
  children,
  onExploreAll,
  headerContent,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  onExploreAll?: () => void;
  headerContent?: ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const key = useId();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [paused, setPaused] = useState(false);
  const animation = useRef(0);
  const targetIndex = useRef(0);
  const started = useRef(false);
  const environment = useRowAdvance(section, key);
  const count = Children.toArray(children).length;
  const stopScroll = () => {
    cancelAnimationFrame(animation.current);
    animation.current = 0;
    scroller.current?.classList.remove("row-animating");
  };
  const animateTo = (left: number, smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    stopScroll();
    const destination = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
    if (!smooth || environment.reduced) { el.scrollTo({ left: destination, behavior: "instant" }); return; }
    const from = el.scrollLeft;
    const start = performance.now();
    el.classList.add("row-animating");
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / SCROLL_DURATION_MS);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      el.scrollTo({ left: from + (destination - from) * eased, behavior: "instant" });
      if (progress < 1) animation.current = requestAnimationFrame(step);
      else { animation.current = 0; el.classList.remove("row-animating"); }
    };
    animation.current = requestAnimationFrame(step);
  };
  const moveTo = (index: number, smooth = true) => {
    const el = scroller.current;
    const target = el?.children[index];
    if (!el || !(target instanceof HTMLElement)) return;
    const first = el.children[0];
    if (!(first instanceof HTMLElement)) return;
    animateTo(target.getBoundingClientRect().left - first.getBoundingClientRect().left, smooth);
    targetIndex.current = index;
  };
  useEffect(() => {
    started.current = false;
    targetIndex.current = 0;
    stopScroll();
    if (environment.active) scroller.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [environment.active, count]);
  const advancing = count > 1 && canAutoAdvance({ ...environment, hover, focus, interacting, paused });
  useEffect(() => {
    if (!advancing) { stopScroll(); return; }
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      started.current = true;
      const el = scroller.current;
      if (el) {
        const children = [...el.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
        const first = children[0];
        if (first) {
          const next = (targetIndex.current + 1) % children.length;
          moveTo(next);
        }
      }
      timer = setTimeout(advance, AUTO_ADVANCE_MS);
    };
    timer = setTimeout(advance, started.current ? AUTO_ADVANCE_MS : ROW_START_DELAY_MS);
    return () => { clearTimeout(timer); stopScroll(); };
  }, [advancing, count]);
  useEffect(() => {
    const end = () => setInteracting(false);
    window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
    return () => { window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) animateTo(el.scrollLeft + dir * el.clientWidth);
  };

  return (
    <section
      ref={section}
      id={id}
      data-auto-active={environment.active}
      data-auto-running={advancing}
      aria-label={title}
      className="group/row relative scroll-mt-20"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false); }}
      onPointerDown={() => setInteracting(true)}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5">
        <h2 className="font-display text-lg font-extrabold text-heading md:text-xl">{title}</h2>
        <div className="ml-auto flex shrink-0 items-center gap-2">
        {onExploreAll && (
          <Button variant="ghost"
            onClick={onExploreAll}
            className="text-xs font-semibold text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-heading"
          >
            Explore all →
          </Button>
        )}
        {count > 1 && <Button size="icon" variant="ghost" className="size-8" aria-label={`${paused ? "Play" : "Pause"} ${title} auto-advance`} title={paused ? "Play" : "Pause"} onClick={() => setPaused((prev) => !prev)}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</Button>}
        </div>
      </div>
      {headerContent && <div className="mx-auto max-w-7xl px-5 pt-3">{headerContent}</div>}
      <div className="relative mx-auto max-w-7xl">
        <div ref={scroller} className="row-scroll px-5 py-4" onScroll={() => {
          const el = scroller.current;
          if (!el) return;
          const first = el.children[0];
          if (!(first instanceof HTMLElement)) return;
          let closest = 0; let distance = Infinity;
          [...el.children].forEach((child, i) => { if (child instanceof HTMLElement) { const d = Math.abs(child.getBoundingClientRect().left - first.getBoundingClientRect().left - el.scrollLeft); if (d < distance) { closest = i; distance = d; } } });
          if (!animation.current) targetIndex.current = closest;
        }}>
          {children}
        </div>
        {hover && (
          <>
            <Button variant="ghost"
              onClick={() => scrollBy(-1)}
              aria-label={`Scroll ${title} left`}
              className="absolute left-0 top-0 bottom-4 hidden h-auto w-12 items-center justify-center rounded-r-md bg-chrome/50 text-heading transition-opacity hover:bg-chrome/75 md:flex"
            >
              <ChevronLeft className="size-8" aria-hidden />
            </Button>
            <Button variant="ghost"
              onClick={() => scrollBy(1)}
              aria-label={`Scroll ${title} right`}
              className="absolute right-0 top-0 bottom-4 hidden h-auto w-12 items-center justify-center rounded-l-md bg-chrome/50 text-heading transition-opacity hover:bg-chrome/75 md:flex"
            >
              <ChevronRight className="size-8" aria-hidden />
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
