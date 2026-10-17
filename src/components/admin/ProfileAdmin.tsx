import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { skillCategories, type Skill } from "@/lib/content";
import { uploadFile, viewUrl } from "./storage";

type Form = {
  name: string; title: string; bio: string; about: string; email: string; phone: string;
  location: string; education: string; avatar_url: string | null; resume_url: string | null;
  github: string; linkedin: string; skills: Skill[];
};

export function ProfileAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: async () => (await supabase.from("profile").select("*").eq("id", 1).maybeSingle()).data,
  });
  const [f, setF] = useState<Form | null>(null);
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = (data?.socials ?? {}) as Record<string, string>;
    setF({
      name: data?.name ?? "", title: data?.title ?? "", bio: data?.bio ?? "", about: data?.about ?? "",
      email: data?.email ?? "", phone: data?.phone ?? "", location: data?.location ?? "", education: data?.education ?? "",
      avatar_url: data?.avatar_url ?? null, resume_url: data?.resume_url ?? null,
      github: s.github ?? "", linkedin: s.linkedin ?? "",
      skills: Array.isArray(data?.skills) ? (data!.skills as Skill[]) : [],
    });
    viewUrl(data?.avatar_url).then(setAvatar);
  }, [data]);

  if (!f) return <p className="text-muted-foreground">Loading…</p>;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF({ ...f, [k]: v });
  const setSkill = (i: number, patch: Partial<Skill>) => set("skills", f.skills.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const upload = async (kind: "avatar" | "resume", file?: File) => {
    if (!file) return;
    try {
      setBusy(true);
      const path = await uploadFile(kind, file);
      if (kind === "avatar") { set("avatar_url", path); setAvatar(URL.createObjectURL(file)); }
      else set("resume_url", path);
      toast.success(kind === "avatar" ? "Photo uploaded. Save to apply." : "Resume uploaded. Save to apply.");
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true);
    const { github, linkedin, ...rest } = f;
    const { error } = await supabase.from("profile").upsert({
      id: 1, ...rest, socials: { github, linkedin },
      skills: f.skills.filter((s) => s.name.trim()), updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile saved"); qc.invalidateQueries({ queryKey: ["admin", "profile"] }); }
  };

  const text = (k: keyof Form, label: string, type = "text") => (
    <div className="space-y-1">
      <Label htmlFor={`f-${k}`}>{label}</Label>
      <Input id={`f-${k}`} type={type} value={f[k] as string} onChange={(e) => set(k, e.target.value as never)} />
    </div>
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-md border-2 bg-card p-5 sm:grid-cols-2">
        {text("name", "Name")}{text("title", "Title")}
        {text("email", "Email", "email")}{text("phone", "Phone")}
        {text("location", "Location")}{text("education", "Education")}
        {text("github", "GitHub link", "url")}{text("linkedin", "LinkedIn link", "url")}
        <div className="space-y-1 sm:col-span-2"><Label htmlFor="f-bio">One-line bio</Label><Input id="f-bio" value={f.bio} onChange={(e) => set("bio", e.target.value)} /></div>
        <div className="space-y-1 sm:col-span-2"><Label htmlFor="f-about">About (leave a blank line between paragraphs)</Label><Textarea id="f-about" rows={7} value={f.about} onChange={(e) => set("about", e.target.value)} /></div>
      </section>

      <section className="grid gap-6 rounded-md border-2 bg-card p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="f-avatar">Portrait photo (up to 5 MB)</Label>
          {avatar && <img src={avatar} alt="Current portrait" className="aspect-[4/5] w-40 rounded-md object-cover" />}
          <Input id="f-avatar" type="file" accept="image/*" onChange={(e) => upload("avatar", e.target.files?.[0])} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="f-resume">Resume (PDF only)</Label>
          <p className="text-sm text-muted-foreground">{f.resume_url ? `Current: ${f.resume_url.split("/").pop()}` : "No resume yet"}</p>
          <Input id="f-resume" type="file" accept="application/pdf,.pdf" onChange={(e) => upload("resume", e.target.files?.[0])} />
        </div>
      </section>

      <section className="space-y-4 rounded-md border-2 bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold">Skills</h2>
          <Button size="sm" variant="outline" onClick={() => set("skills", [...f.skills, { name: "", level: 50, category: "Languages" }])}><Plus /> Add skill</Button>
        </div>
        {f.skills.map((s, i) => (
          <div key={i} className="grid items-center gap-3 sm:grid-cols-[1fr_10rem_1fr_3rem_auto]">
            <Input aria-label="Skill name" placeholder="Skill" value={s.name} onChange={(e) => setSkill(i, { name: e.target.value })} />
            <select aria-label="Category" value={s.category} onChange={(e) => setSkill(i, { category: e.target.value })} className="h-9 rounded-md border bg-background px-2 text-sm">
              {skillCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Slider aria-label={`${s.name || "Skill"} level`} min={0} max={100} step={5} value={[s.level]} onValueChange={([v]) => setSkill(i, { level: v ?? 0 })} />
            <span className="font-mono text-sm">{s.level}%</span>
            <Button size="icon" variant="ghost" aria-label="Remove skill" onClick={() => set("skills", f.skills.filter((_, j) => j !== i))}><Trash2 /></Button>
          </div>
        ))}
      </section>

      <Button size="lg" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
    </div>
  );
}
