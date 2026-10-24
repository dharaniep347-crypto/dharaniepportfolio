import { describe, expect, it } from "vitest";
import { academicStats, education, certificates, filterCertificates } from "@/data/portfolio";
import { profileRows } from "@/components/stream/state";

describe("education", () => {
  it("keeps the corrected 2024 – 2028 degree and graduation", () => {
    expect(education[0]?.years).toBe("2024 – 2028");
    expect(education[0]?.expectedGraduation).toBe(2028);
    expect(education[0]?.status).toBe("Pursuing, third year");
  });
  it("uses the confirmed overall 8.03 out of 10", () => {
    const entry = education[0];
    if (!entry) throw new Error("Missing degree");
    expect(academicStats(entry).overall).toBe(8.03);
  });
  it("uses the exact four semester results", () => {
    expect(education[0]?.semesters?.slice(0, 4).map((s) => s.cgpa)).toEqual([7.86, 7.86, 8.18, 8.08]);
  });
  it("has semester 5 in progress without a number", () => {
    expect(education[0]?.semesters?.[4]).toEqual({ semester: 5, cgpa: null });
  });
  it("tracks semester five of eight", () => {
    expect([education[0]?.currentSemester, education[0]?.totalSemesters]).toEqual([5, 8]);
  });
  it("identifies semester three as highest and four completed", () => {
    const entry = education[0];
    if (!entry) throw new Error("Missing degree");
    const stats = academicStats(entry);
    expect([stats.highest, stats.completed.find((s) => s.cgpa === stats.highest)?.semester, stats.count]).toEqual([8.18, 3, 4]);
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
  it("keeps the supplied Higher Secondary record", () => {
    expect(education.find((e) => e.id === "higher-secondary")).toMatchObject({
      institution: "Govt Hr Sec School, Kaniyalampatti, Karur", years: "March 2024",
      board: "State Board of School Examinations, Tamil Nadu", score: "461 / 600 (76.8%)",
      group: "General Education (Physics, Chemistry, Biology, Maths)", medium: "Tamil", status: "Passed",
      subjects: [{ subject: "Tamil", marks: 97 }, { subject: "English", marks: 75 }, { subject: "Physics", marks: 65 }, { subject: "Chemistry", marks: 85 }, { subject: "Biology", marks: 73 }, { subject: "Mathematics", marks: 66 }],
    });
  });
  it("keeps the supplied Secondary record", () => {
    expect(education.find((e) => e.id === "secondary")).toMatchObject({
      institution: "Government High School, Thennilai, Kadavur", years: "May 2022",
      board: "State Board of School Examinations, Tamil Nadu", score: "398 / 500 (79.6%)", medium: "Tamil", status: "Passed",
      subjects: [{ subject: "Tamil", marks: 86 }, { subject: "English", marks: 77 }, { subject: "Mathematics", marks: 70 }, { subject: "Science", marks: 75 }, { subject: "Social Science", marks: 90 }],
    });
  });
  it("uses the explicitly requested highlighted subjects", () => {
    expect(education.find((e) => e.id === "higher-secondary")?.topSubject).toBe("Chemistry");
    expect(education.find((e) => e.id === "secondary")?.topSubject).toBe("Social Science");
  });
  it("stores only allowlisted public academic fields", () => {
    const allowed = new Set(["id", "institution", "qualification", "years", "status", "board", "score", "group", "expectedGraduation", "overallCgpa", "currentSemester", "totalSemesters", "semesters", "medium", "subjects", "topSubject", "marksBasis"]);
    for (const entry of education) expect(Object.keys(entry).filter((key) => !allowed.has(key))).toEqual([]);
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