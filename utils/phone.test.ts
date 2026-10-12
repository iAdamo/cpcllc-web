import { describe, expect, it } from "vitest";
import {
  formatUsDigits,
  isValidUsPhoneNumber,
  normalizePhoneNumber,
  usPhoneFromDigits,
} from "./phone";

describe("US phone numbers (the marketplace is US only)", () => {
  it("normalizes what people type to E.164", () => {
    expect(normalizePhoneNumber("+1 (813) 897-1727")).toBe("+18138971727");
    expect(normalizePhoneNumber("1 813 897 1727")).toBe("+18138971727");
    expect(normalizePhoneNumber("001 813 897 1727")).toBe("+18138971727");
    expect(normalizePhoneNumber("  ")).toBe("");
  });

  it("accepts only +1 and ten digits", () => {
    expect(isValidUsPhoneNumber("+18138971727")).toBe(true);
    expect(isValidUsPhoneNumber("+44 7911 123456")).toBe(false);
    expect(isValidUsPhoneNumber("+1 813 897 172")).toBe(false);
    expect(isValidUsPhoneNumber("813 897 1727")).toBe(false);
  });

  it("builds the number from the digits typed after +1", () => {
    expect(usPhoneFromDigits("(813) 897-1727")).toBe("+18138971727");
  });

  it("formats digits as they are typed, ten at most", () => {
    expect(formatUsDigits("81")).toBe("81");
    expect(formatUsDigits("8138")).toBe("(813) 8");
    expect(formatUsDigits("8138971")).toBe("(813) 897-1");
    expect(formatUsDigits("813897172799")).toBe("(813) 897-1727");
  });
});
