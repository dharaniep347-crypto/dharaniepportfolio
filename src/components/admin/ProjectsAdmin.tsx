import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichText } from "./RichText";
import { uploadFile, viewUrl } from "./storage";

type Project = Tables<"projects">;
type Draft = Omit<Project, "id" | "created_at"> & { id?: string };

const empty = (order: number): Draft => ({
  title: "", short_description: "", description: "", image_url: null, technologies: [],
  category: "AI", live_url: "", github_url: "", featured: false, sort_order: order,
});

export function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const [list, setList] = useState<Project[]>([]);
  useEffect(() => setList(rows), [rows]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });

  const saveOrder = async (next: Project[]) => {
    setList(next);
    const results = await Promise.all(next.map((p, i) => supabase.from("projects").update({ sort_order: i }).eq("id", p.id)));
    if (results.some((r) => r.error)) toast.error("Couldn't save the new order");
    refresh();
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    saveOrder(next);
  };
  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) toast.error(error.message); else { toast.success("Project deleted"); refresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">Drag rows or use the arrows to change the order on your site.</p>
        <Button onClick={() => setEditing(empty(list.length))}><Plus /> Add project</Button>
      </div>
      <ul className="divide-y rounded-md border-2 bg-card">
        {list.map((p, i) => (
          <li key={p.id} draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); }}
            className={`flex items-center gap-3 px-3 py-3 ${dragIdx === i ? "opacity-50" : ""}`}>
            <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{p.title} {p.featured && <span className="ml-1 rounded-sm bg-accent px-1.5 text-xs">Featured</span>}</p>
              <p className="truncate text-sm text-muted-foreground">{p.category} · {p.technologies.join(", ")}</p>
            </div>
            <Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}><ArrowUp /></Button>
            <Button size="icon" variant="ghost" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, i + 1)}><ArrowDown /></Button>
            <Button size="icon" variant="ghost" aria-label={`Edit ${p.title}`} onClick={() => setEditing(p)}><Pencil /></Button>
            <Button size="icon" variant="ghost" aria-label={`Delete ${p.title}`} onClick={() => remove(p)}><Trash2 /></Button>
          </li>
        ))}
        {!list.length && <li className="p-4 text-muted-foreground">No projects yet.</li>}
      </ul>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit project" : "Add project"}</DialogTitle></DialogHeader>
          {editing && <ProjectForm initial={editing} onDone={() => { setEditing(null); refresh(); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectForm({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [tech, setTech] = useState(initial.technologies.join(", "));
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { viewUrl(initial.image_url).then(setPreview); }, [initial.image_url]);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const onImage = async (f: File | undefined) => {
    if (!f) return;
    try {
      setBusy(true);
      const path = await uploadFile("projects", f);
      set("image_url", path);
      setPreview(URL.createObjectURL(f));
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.title.trim()) { toast.error("Add a title"); return; }
    if (d.title.length > 200 || d.short_description.length > 300) { toast.error("Title or short description is too long"); return; }
    setBusy(true);
    const { id, ...row } = { ...d, technologies: tech.split(",").map((t) => t.trim()).filter(Boolean) };
    const { error } = id
      ? await supabase.from("projects").update(row).eq("id", id)
      : await supabase.from("projects").insert(row);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Project saved");
    onDone();
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="space-y-1"><Label htmlFor="p-title">Title</Label><Input id="p-title" maxLength={200} value={d.title} onChange={(e) => set("title", e.target.value)} /></div>
      <div className="space-y-1"><Label htmlFor="p-short">Short description</Label><Input id="p-short" maxLength={300} value={d.short_description} onChange={(e) => set("short_description", e.target.value)} /></div>
      <div className="space-y-1"><Label>Description</Label><RichText value={d.description} onChange={(v) => set("description", v)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1"><Label htmlFor="p-cat">Category</Label><Input id="p-cat" value={d.category} onChange={(e) => set("category", e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="p-tech">Technologies (comma separated)</Label><Input id="p-tech" value={tech} onChange={(e) => setTech(e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="p-live">Live demo link</Label><Input id="p-live" type="url" value={d.live_url} onChange={(e) => set("live_url", e.target.value)} /></div>
        <div className="space-y-1"><Label htmlFor="p-gh">Source code link</Label><Input id="p-gh" type="url" value={d.github_url} onChange={(e) => set("github_url", e.target.value)} /></div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-img">Image (up to 5 MB)</Label>
        {preview && <img src={preview} alt="Project preview" className="aspect-video w-full rounded-md object-cover" />}
        <Input id="p-img" type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} />
        {d.image_url && <Button type="button" size="sm" variant="ghost" onClick={() => { set("image_url", null); setPreview(""); }}>Remove image</Button>}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold"><Switch checked={d.featured} onCheckedChange={(v) => set("featured", v)} /> Featured</label>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save project"}</Button>
    </form>
  );
}
