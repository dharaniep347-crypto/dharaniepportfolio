import { describe, expect, it } from "vitest";
import { GITHUB_PAGES_BASE, withBasePath } from "@/lib/site-path";

describe("GitHub Pages repository paths", () => {
  it("uses the requested repository mount", () => {
    expect(GITHUB_PAGES_BASE).toBe("/dharaniepportfolio/");
    expect(withBasePath("/admin", GITHUB_PAGES_BASE)).toBe("/dharaniepportfolio/admin");
  });
  it("keeps uploaded assets under the repository path", () => {
    expect(withBasePath("/__l5e/assets-v1/photo.jpg", GITHUB_PAGES_BASE)).toBe("/dharaniepportfolio/__l5e/assets-v1/photo.jpg");
  });
  it("does not prefix paths twice", () => {
    expect(withBasePath("/dharaniepportfolio/favicon.ico", GITHUB_PAGES_BASE)).toBe("/dharaniepportfolio/favicon.ico");
  });
  it("preserves external signed URLs and contact protocols", () => {
    expect(withBasePath("https://example.com/image?token=abc", GITHUB_PAGES_BASE)).toBe("https://example.com/image?token=abc");
    expect(withBasePath("mailto:dharaniep347@gmail.com", GITHUB_PAGES_BASE)).toBe("mailto:dharaniep347@gmail.com");
  });
  it("preserves the existing root deployment", () => {
    expect(withBasePath("/favicon.ico", "/")).toBe("/favicon.ico");
  });
});
