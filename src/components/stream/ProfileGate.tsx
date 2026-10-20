import { Briefcase, Code2, Users, Compass } from "lucide-react";
import { viewerProfiles, type ViewerProfile } from "./state";

const icons = { briefcase: Briefcase, code: Code2, users: Users, compass: Compass } as const;

export default function ProfileGate({ onPick }: { onPick: (p: ViewerProfile) => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <h1 className="font-wide mb-12 text-center text-4xl md:text-6xl">Who's watching?</h1>
      <ul className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
        {viewerProfiles.map((p) => {
          const Icon = icons[p.icon as keyof typeof icons];
          return (
            <li key={p.id}>
              <button
                onClick={() => onPick(p.id)}
                className="group flex w-32 flex-col items-center gap-3 sm:w-40"
                aria-label={`Continue as ${p.label}`}
              >
                <span
                  className="flex aspect-square w-full items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-heading"
                  style={{ background: p.gradient }}
                >
                  <Icon className="size-12 text-heading sm:size-16" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-muted-foreground transition-colors group-hover:text-heading">
                  {p.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
