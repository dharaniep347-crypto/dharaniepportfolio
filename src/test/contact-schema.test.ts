import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const ok = { name: "Asha", email: "a@example.com", subject: "Hello", message: "A long enough message." };

describe("contact form limits", () => {
  it("accepts a valid message", () => expect(contactSchema.safeParse(ok).success).toBe(true));
  it("rejects names over 100 characters", () =>
    expect(contactSchema.safeParse({ ...ok, name: "a".repeat(101) }).success).toBe(false));
  it("rejects subjects over 150 characters", () =>
    expect(contactSchema.safeParse({ ...ok, subject: "a".repeat(151) }).success).toBe(false));
  it("rejects messages over 2000 characters", () =>
    expect(contactSchema.safeParse({ ...ok, message: "a".repeat(2001) }).success).toBe(false));
  it("rejects messages under 10 characters", () =>
    expect(contactSchema.safeParse({ ...ok, message: "short" }).success).toBe(false));
  it("rejects invalid emails", () =>
    expect(contactSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false));
});
