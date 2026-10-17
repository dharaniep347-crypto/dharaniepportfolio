import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function MessagesAdmin() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const setRead = async (id: string, read: boolean) => {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) toast.error(error.message); else refresh();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Message deleted"); refresh(); }
  };
  const toggle = (id: string, read: boolean) => {
    setOpenId(openId === id ? null : id);
    if (!read) setRead(id, true);
  };

  if (isLoading) return <p className="text-muted-foreground">Loading messages…</p>;
  if (!messages.length) return <p className="text-muted-foreground">No messages yet.</p>;
  return (
    <ul className="divide-y rounded-md border-2 bg-card">
      {messages.map((m) => (
        <li key={m.id}>
          <button onClick={() => toggle(m.id, m.read)} aria-expanded={openId === m.id}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted">
            <span className={`size-2.5 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-primary"}`} aria-label={m.read ? undefined : "Unread"} />
            <span className="min-w-0 flex-1">
              <span className={`block truncate ${m.read ? "" : "font-bold"}`}>{m.subject}</span>
              <span className="block truncate text-sm text-muted-foreground">{m.name} · {m.email}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
          </button>
          {openId === m.id && (
            <div className="space-y-4 px-4 pb-4 pl-9">
              <p className="whitespace-pre-wrap">{m.message}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}>Reply by email</a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setRead(m.id, false); setOpenId(null); }}>Mark unread</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(m.id)}>Delete</Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
