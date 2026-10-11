import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactMethods from "./ContactMethods";
import { ContactDetailsSection } from "@/screens/admin/sections/ContactDetailsSection";
import { adminKeys } from "@/hooks/admin/adminQueryKeys";
import { CONTACT, contactProblems, mapsUrl, phoneHref, shownContact } from "@/lib/contact";

/**
 * Contact details from Admin > Settings (Adam, 2026-10-11: "what if I get a
 * new one and want to change?"): one save changes /contact, the footer, the
 * app and the emails. Rules match cpcllc-backend app-config/contact.ts.
 */
const withData = (key: readonly unknown[], data: unknown, el: React.ReactElement) => {
  const qc = new QueryClient();
  qc.setQueryData(key, data);
  return renderToStaticMarkup(<QueryClientProvider client={qc}>{el}</QueryClientProvider>);
};

describe("contact rules (the API's)", () => {
  it("today's details until staff save; saved ones win; an empty phone stays hidden", () => {
    expect(shownContact(undefined)).toEqual(CONTACT);
    expect(shownContact({ email: "help@companiescenter.com" }).email).toBe("help@companiescenter.com");
    expect(shownContact({ phone: "" }).phone).toBe("");
    expect(shownContact({ address: [] }).address).toEqual(CONTACT.address);
  });

  it("checks each field in the API's words", () => {
    expect(contactProblems(CONTACT)).toEqual({});
    expect(contactProblems({ ...CONTACT, email: "nope" }).email).toMatch(/full address/);
    expect(contactProblems({ ...CONTACT, phone: "call us" }).phone).toMatch(/number/);
    expect(contactProblems({ ...CONTACT, phone: "" })).toEqual({});
    expect(contactProblems({ ...CONTACT, address: [] }).address).toMatch(/at least one line/);
    expect(contactProblems({ ...CONTACT, address: ["a", "b", "c", "d", "e"] }).address).toMatch(/up to 4/);
  });

  it("links: tel keeps digits and +, maps searches the whole address", () => {
    expect(phoneHref("+1 (813) 897-1727")).toBe("tel:+18138971727");
    expect(mapsUrl(["400 N Ashley Dr, Suite 1900", "Tampa, FL 33602"])).toContain("400%20N%20Ashley%20Dr");
  });
});

describe("/contact", () => {
  it("shows what staff saved", () => {
    const html = withData(
      ["public-app-config"],
      { contact: { email: "help@companiescenter.com", phone: "+1 555 010 0000", address: ["1 New St", "Tampa, FL 33602"] } },
      <ContactMethods />,
    );
    expect(html).toContain('href="mailto:help@companiescenter.com"');
    expect(html).toContain('href="tel:+15550100000"');
    expect(html).toContain("1 New St");
    expect(html).not.toContain(CONTACT.email);
  });

  it("no phone saved: no phone card; before the config loads: today's details", () => {
    const noPhone = withData(["public-app-config"], { contact: { ...CONTACT, phone: "" } }, <ContactMethods />);
    expect(noPhone).not.toContain("Call us");
    const loading = withData(["other"], null, <ContactMethods />);
    expect(loading).toContain(`mailto:${CONTACT.email}`);
    expect(loading).toContain("400 N Ashley Dr, Suite 1900");
  });
});

describe("Admin > Settings > Contact details", () => {
  it("opens with the saved details, one labelled field each, and the policy reminder", () => {
    const html = withData(
      adminKeys.appConfig,
      { contact: { email: "help@companiescenter.com", phone: "", address: ["1 New St", "Tampa, FL 33602"] } },
      <ContactDetailsSection />,
    );
    expect(html).toContain('value="help@companiescenter.com"');
    expect(html).toContain("1 New St\nTampa, FL 33602");
    for (const id of ["contact-email", "contact-phone", "contact-address"]) {
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).toContain("Privacy Policy (section 35)");
  });
});
