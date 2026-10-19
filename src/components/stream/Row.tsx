import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [hover, setHover] = useState(false);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section
      id={id}
      aria-label={title}
      className="group/row relative scroll-mt-20"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="mx-auto flex max-w-7xl items-baseline justify-between px-5">
        <h2 className="font-display text-lg font-extrabold text-[#e6e9fa] md:text-xl">{title}</h2>
        {onExploreAll && (
          <button
            onClick={onExploreAll}
            className="text-xs font-semibold text-[#9aa0c3] opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-[#f3f4fb]"
          >
            Explore all →
          </button>
        )}
      </div>
      {headerContent && <div className="mx-auto max-w-7xl px-5 pt-3">{headerContent}</div>}
      <div className="relative mx-auto max-w-7xl">
        <div ref={scroller} className="row-scroll px-5 py-4">
          {children}
        </div>
        {hover && (
          <>
            <button
              onClick={() => scrollBy(-1)}
              aria-label={`Scroll ${title} left`}
              className="absolute left-0 top-0 bottom-4 hidden w-12 items-center justify-center rounded-r-md bg-black/50 text-[#f3f4fb] transition-opacity hover:bg-black/75 md:flex"
            >
              <ChevronLeft className="size-8" aria-hidden />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label={`Scroll ${title} right`}
              className="absolute right-0 top-0 bottom-4 hidden w-12 items-center justify-center rounded-l-md bg-black/50 text-[#f3f4fb] transition-opacity hover:bg-black/75 md:flex"
            >
              <ChevronRight className="size-8" aria-hidden />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
