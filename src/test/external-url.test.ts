import { describe, expect, it } from "vitest";
import { normalizeExternalUrl, phoneHref } from "@/lib/external-url";
import { profile } from "@/data/portfolio";

describe("public contact destinations", () => {
  it("uses the exact LinkedIn destination without a trailing slash", () => {
    expect(profile.linkedin).toBe("https://www.linkedin.com/in/dharani-e-p-64a32b338");
  });
  it("uses the exact GitHub destination", () => {
    expect(profile.github).toBe("https://github.com/dharaniep347-crypto");
  });
  it("uses the requested email destination", () => {
    expect(`mailto:${profile.email}`).toBe("mailto:dharaniep347@gmail.com");
  });
  it("removes spacing from the phone destination", () => {
    expect(phoneHref(profile.phone)).toBe("tel:+919159048874");
  });
  it("qualifies a bare social domain with https", () => {
    expect(normalizeExternalUrl("www.linkedin.com/in/dharani-e-p-64a32b338")).toBe("https://www.linkedin.com/in/dharani-e-p-64a32b338");
  });
  it("preserves existing full URLs", () => {
    expect(normalizeExternalUrl("https://github.com/dharaniep347-crypto")).toBe("https://github.com/dharaniep347-crypto");
  });
  it("preserves private signed asset paths and empty project links", () => {
    expect(normalizeExternalUrl("/__l5e/assets-v1/resume.pdf")).toBe("/__l5e/assets-v1/resume.pdf");
    expect(normalizeExternalUrl("")).toBe("");
  });
});