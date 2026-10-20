// Only the static Pages build uses this adapter. Existing RLS is the boundary.
import { supabase } from "@/integrations/supabase/client";
import { contactSchema } from "@/lib/contact-schema";
import { fallbackContent, type SiteContent } from "@/lib/content";
import { withBasePath } from "@/lib/site-path";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const [{ data: prof, error: profileError }, { data: projects, error: projectError }] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").order("sort_order"),
    ]);
    if (profileError || projectError) throw new Error("Content unavailable");
    const paths = [prof?.avatar_url, prof?.resume_url, ...(projects ?? []).map(p => p.image_url)]
      .filter((p): p is string => Boolean(p) && !p?.startsWith("/") && !p?.startsWith("http"));
    const signed = new Map<string, string>();
    if (paths.length) {
      const { data } = await supabase.storage.from("portfolio-files").createSignedUrls(paths, 60 * 60 * 24 * 7);
      data?.forEach(d => { if (d.path && d.signedUrl) signed.set(d.path, d.signedUrl); });
    }
    const resolve = (p: string | null) => p ? signed.get(p) ?? (p.startsWith("/") || p.startsWith("http") ? withBasePath(p) : "") : "";
    const fb = fallbackContent();
    const socials = (prof?.socials ?? {}) as Record<string, string>;
    const skills = Array.isArray(prof?.skills) ? prof.skills as SiteContent["skills"] : [];
    return {
      profile: prof ? {
        name: prof.name || fb.profile.name, title: prof.title, bio: prof.bio,
        about: prof.about.split(/\n\s*\n/).filter(Boolean), email: prof.email,
        phone: prof.phone, location: prof.location, education: prof.education,
        github: socials["github"] ?? "", linkedin: socials["linkedin"] ?? "",
        portrait: resolve(prof.avatar_url), resume: resolve(prof.resume_url),
      } : fb.profile,
      skills: skills.length ? skills : fb.skills,
      projects: projects?.length ? projects.map(p => ({
        id: p.id, title: p.title, category: p.category, summary: p.short_description,
        description: p.description, tags: p.technologies, image: resolve(p.image_url),
        demo: p.live_url, source: p.github_url, featured: p.featured,
      })) : fb.projects,
    };
  } catch {
    return fallbackContent();
  }
}

export async function submitMessage({ data }: { data: unknown }) {
  const input = contactSchema.parse(data);
  // Database CHECK constraints validate lengths; RLS prevents public inbox reads.
  const { error } = await supabase.from("messages").insert(input);
  return error
    ? { ok: false as const, error: "Your message couldn't be sent. Please try again." }
    : { ok: true as const };
}
