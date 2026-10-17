import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { contactSchema } from "@/lib/contact-schema";
import { fallbackContent, type SiteContent } from "@/lib/content";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const BUCKET = "portfolio-files";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    const sb = publicClient();
    const [{ data: prof }, { data: projs }] = await Promise.all([
      sb.from("profile").select("*").eq("id", 1).maybeSingle(),
      sb.from("projects").select("*").order("sort_order"),
    ]);
    const paths = [
      prof?.avatar_url,
      prof?.resume_url,
      ...(projs ?? []).map((p) => p.image_url),
    ].filter((p): p is string => !!p && !p.startsWith("/") && !p.startsWith("http"));
    const signed = new Map<string, string>();
    if (paths.length) {
      const { data } = await sb.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
      data?.forEach((d) => d.path && d.signedUrl && signed.set(d.path, d.signedUrl));
    }
    const resolve = (p: string | null | undefined) => (p ? signed.get(p) ?? (p.startsWith("/") || p.startsWith("http") ? p : "") : "");
    const fb = fallbackContent();
    const socials = (prof?.socials ?? {}) as Record<string, string>;
    const skills = Array.isArray(prof?.skills) ? (prof!.skills as SiteContent["skills"]) : [];
    return {
      profile: prof
        ? {
            name: prof.name || fb.profile.name,
            title: prof.title,
            bio: prof.bio,
            about: prof.about.split(/\n\s*\n/).filter(Boolean),
            email: prof.email,
            phone: prof.phone,
            location: prof.location,
            education: prof.education,
            github: socials.github ?? "",
            linkedin: socials.linkedin ?? "",
            portrait: resolve(prof.avatar_url),
            resume: resolve(prof.resume_url),
          }
        : fb.profile,
      skills: skills.length ? skills : fb.skills,
      projects: projs?.length
        ? projs.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            summary: p.short_description,
            description: p.description,
            tags: p.technologies,
            image: resolve(p.image_url),
            demo: p.live_url,
            source: p.github_url,
            featured: p.featured,
          }))
        : fb.projects,
    };
  } catch (e) {
    console.error("getSiteContent failed", e);
    return fallbackContent();
  }
});

export const submitMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) {
      console.error("submitMessage failed", error);
      return { ok: false as const, error: "Your message couldn't be sent. Please try again." };
    }
    return { ok: true as const };
  });
