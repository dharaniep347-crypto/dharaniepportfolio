import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, profileRead, projectRead, sign } = vi.hoisted(() => ({
  insert: vi.fn(), profileRead: vi.fn(), projectRead: vi.fn(), sign: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => table === "messages" ? { insert } : {
      select: () => table === "profile"
        ? { eq: () => ({ maybeSingle: profileRead }) }
        : { order: projectRead },
    },
    storage: { from: () => ({ createSignedUrls: sign }) },
  },
}));

import { getSiteContent, submitMessage } from "@/lib/content.pages";

beforeEach(() => vi.resetAllMocks());

describe("Pages cloud adapter", () => {
  it("reads database projects rather than replacing them with fallback projects", async () => {
    profileRead.mockResolvedValue({ data: null, error: null });
    projectRead.mockResolvedValue({ error: null, data: [{
      id: "project-1", title: "Database project", category: "Web", short_description: "Live data",
      description: "<p>Project</p>", technologies: ["React"], image_url: "projects/image.jpg",
      live_url: "", github_url: "", featured: true,
    }] });
    sign.mockResolvedValue({ data: [{ path: "projects/image.jpg", signedUrl: "https://example.com/signed.jpg" }] });
    const content = await getSiteContent();
    expect(content.projects[0]?.title).toBe("Database project");
    expect(content.projects[0]?.image).toBe("https://example.com/signed.jpg");
    expect(sign).toHaveBeenCalledWith(["projects/image.jpg"], 604800);
  });
  it("preserves the existing fallback when cloud content is unavailable", async () => {
    profileRead.mockResolvedValue({ data: null, error: new Error("Unavailable") });
    projectRead.mockResolvedValue({ data: null, error: null });
    expect((await getSiteContent()).profile.name).toBe("Dharani E P");
  });
  it("submits validated messages to the existing inbox", async () => {
    insert.mockResolvedValue({ error: null });
    const data = { name: "Pages visitor", email: "visitor@example.com", subject: "Portfolio enquiry", message: "I would like to discuss a project." };
    expect(await submitMessage({ data })).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith(data);
  });
  it("rejects invalid email addresses before inserting", async () => {
    await expect(submitMessage({ data: { name: "Visitor", email: "invalid", subject: "Hello", message: "A sufficiently long message." } })).rejects.toThrow();
    expect(insert).not.toHaveBeenCalled();
  });
});