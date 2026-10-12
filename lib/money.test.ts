import { describe, expect, it } from "vitest";
import { formatMoney } from "./money";

describe("formatMoney", () => {
  it("dollars, the marketplace currency", () => {
    expect(formatMoney(1250, "USD")).toBe("$1,250");
    expect(formatMoney(1250)).toBe("$1,250");
    expect(formatMoney(1250, null)).toBe("$1,250");
  });

  it("cents, as invoices and plans store them", () => {
    expect(formatMoney(125000, "USD", { cents: true })).toBe("$1,250.00");
  });

  it("another currency keeps its code instead of a dollar sign", () => {
    expect(formatMoney(1250, "EUR")).toBe("1,250 EUR");
    expect(formatMoney(125000, "gbp", { cents: true })).toBe("1,250.00 GBP");
  });
});
