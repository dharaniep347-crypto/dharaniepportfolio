import { describe, expect, it } from "vitest";
import { academicStats, education, certificates, filterCertificates } from "@/data/portfolio";
import { profileRows } from "@/components/stream/state";

describe("education", () => {
  it("keeps the confirmed 2023–2027 degree and graduation", () => {
    expect(education[0]?.years).toBe("2023–2027");
    expect(education[0]?.expectedGraduation).toBe(2027);
    expect(education[0]?.status).toBe("Pursuing, third year");
  });
  it("does not invent missing grades", () => {
    const entry = education[0];
    if (!entry) throw new Error("Missing degree");
    expect(academicStats(entry)).toEqual({ completed: [], overall: null, highest: null, count: null });
  });
  it("uses the supplied overall CGPA rather than averaging semester values", () => {
    const entry = education[0];
    if (!entry) throw new Error("Missing degree");
    expect(academicStats({ ...entry, overallCgpa: 8.25, semesters: [{ semester: 1, cgpa: 8 }, { semester: 2, cgpa: 9 }] })).toEqual({ completed: [{ semester: 1, cgpa: 8 }, { semester: 2, cgpa: 9 }], overall: 8.25, highest: 9, count: 2 });
  });
  it("places Recruiter education immediately after summary", () => {
    expect(profileRows.recruiter.slice(0, 2)).toEqual(["summary", "education"]);
  });
  it("includes both new sections for every viewer", () => {
    for (const rows of Object.values(profileRows)) {
      expect(rows).toContain("education");
      expect(rows).toContain("certificates");
    }
  });
});
describe("certificates", () => {
  it("includes the five supplied certificates", () => {
    expect(filterCertificates(certificates, "All")).toHaveLength(5);
  });
  it("filters Web certificates without unrelated hackathons", () => {
    expect(filterCertificates(certificates, "Web").map((c) => c.id)).toEqual(["texperia", "nexora"]);
  });
  it("leaves absent AI and Cloud credentials empty", () => {
    expect(filterCertificates(certificates, "AI")).toEqual([]);
    expect(filterCertificates(certificates, "Cloud")).toEqual([]);
    expect(certificates.every((c) => c.credential === "")).toBe(true);
  });
});