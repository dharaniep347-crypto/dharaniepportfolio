import { describe, expect, it } from "vitest";
import { AUTO_ADVANCE_MS, ROW_START_DELAY_MS, SCROLL_DURATION_MS, closestVisibleRow, canAutoAdvance } from "@/components/stream/row-advance";

describe("visible row auto-advance", () => {
  it("requires at least sixty percent visible", () => {
    expect(closestVisibleRow([{ id: "skills", ratio: 0.59, centre: 450 }], 900)).toBeNull();
    expect(closestVisibleRow([{ id: "skills", ratio: 0.6, centre: 450 }], 900)).toBe("skills");
  });
  it("selects only the row closest to the vertical centre", () => {
    expect(closestVisibleRow([{ id: "skills", ratio: 1, centre: 250 }, { id: "certificates", ratio: 0.8, centre: 460 }], 900)).toBe("certificates");
  });
  it("uses a one second start and one second advance", () => {
    expect(ROW_START_DELAY_MS).toBe(1000);
    expect(AUTO_ADVANCE_MS).toBe(1000);
  });
  it("completes smooth movement in half a second before the next advance", () => { expect(SCROLL_DURATION_MS).toBe(500); expect(SCROLL_DURATION_MS).toBeLessThan(AUTO_ADVANCE_MS); });
  const ready = { active: true, hover: false, focus: false, interacting: false, paused: false, hidden: false, dialog: false, reduced: false };
  it("never advances an inactive row", () => { expect(canAutoAdvance({ ...ready, active: false })).toBe(false); expect(canAutoAdvance(ready)).toBe(true); });
  for (const rule of ["hover", "focus", "interacting", "paused", "hidden", "dialog", "reduced"] as const) {
    it(`pauses for ${rule}`, () => { expect(canAutoAdvance({ ...ready, [rule]: true })).toBe(false); });
  }
});