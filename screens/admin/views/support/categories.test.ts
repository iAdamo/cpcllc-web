import { describe, expect, it } from "vitest";
import { TICKET_CATEGORIES, ticketCategoryLabel } from "./categories";

describe("ticket categories", () => {
  it("names the app's service requests for the queue", () => {
    expect(ticketCategoryLabel("service_request")).toBe("Service request");
    expect(TICKET_CATEGORIES.map((c) => c.value)).toContain("service_request");
  });

  it("gives every category its own value and label, so the filter is unambiguous", () => {
    const values = TICKET_CATEGORIES.map((c) => c.value);
    const labels = TICKET_CATEGORIES.map((c) => c.label);
    expect(new Set(values).size).toBe(values.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("shows a category it does not know yet as itself, and nothing for none", () => {
    expect(ticketCategoryLabel("brand_new")).toBe("brand_new");
    expect(ticketCategoryLabel(undefined)).toBe("");
  });
});
