import { describe, expect, it } from "vitest";
import { filterProjects } from "@/data/portfolio";

const items = [
  { id: 1, category: "AI and Full Stack" },
  { id: 2, category: "AI and Full Stack" },
  { id: 3, category: "Web" },
  { id: 4, category: "AI and Data Science" },
];

describe("project category filtering", () => {
  it("All includes all four projects", () => {
    expect(filterProjects(items, "All").map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });
  it("AI and Full Stack includes only matching projects", () => {
    expect(filterProjects(items, "AI and Full Stack").map((p) => p.id)).toEqual([1, 2]);
  });
  it("AI and Data Science includes only matching projects", () => {
    expect(filterProjects(items, "AI and Data Science").map((p) => p.id)).toEqual([4]);
  });
  it("Web includes only matching projects", () => {
    expect(filterProjects(items, "Web").map((p) => p.id)).toEqual([3]);
  });
});