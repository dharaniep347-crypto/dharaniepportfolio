import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export function Overview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const since = new Date(Date.now() - 6 * 864e5);
      since.setHours(0, 0, 0, 0);
      const [p, f, m, u, recent] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("messages").select("created_at").gte("created_at", since.toISOString()),
      ]);
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(since.getTime() + i * 864e5);
        return { key: d.toDateString(), day: d.toLocaleDateString(undefined, { weekday: "short" }), messages: 0 };
      });
      recent.data?.forEach((r) => {
        const day = days.find((d) => d.key === new Date(r.created_at).toDateString());
        if (day) day.messages++;
      });
      return { projects: p.count ?? 0, featured: f.count ?? 0, messages: m.count ?? 0, unread: u.count ?? 0, days };
    },
  });
  const stats = [
    ["Projects", data?.projects],
    ["Featured projects", data?.featured],
    ["Messages", data?.messages],
    ["Unread messages", data?.unread],
  ] as const;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-md border-2 border-ink bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-wide text-4xl">{n ?? "–"}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border-2 bg-card p-5">
        <h2 className="mb-4 font-display text-lg font-extrabold">Messages in the last 7 days</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.days ?? []}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="messages" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
