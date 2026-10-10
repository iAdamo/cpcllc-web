import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BroadcastPopupSection } from "./BroadcastPopupSection";
import type { Broadcast } from "@/axios/broadcast";

/** The composer's popup card, rendered as the admin sees it. */
const render = (form: Partial<Broadcast>) =>
  renderToStaticMarkup(
    <BroadcastPopupSection
      form={form}
      onToggle={() => {}}
      onChange={() => {}}
      onUpload={async () => ""}
    />,
  );

const names = (html: string) =>
  [...html.matchAll(/aria-label="([^"]+)"/g)].map((m) => m[1]);

describe("popup card", () => {
  it("off: a switch that says so, nothing else", () => {
    const html = render({ popup: false });
    expect(html).toContain('role="switch" aria-checked="false" aria-label="Show as a popup"');
    expect(html).not.toContain('name="popup-size"');
  });

  it("on: three sizes with the picked one checked, the export size, and a preview with the X", () => {
    const html = render({ popup: true, popupSize: "LG", popupImage: "https://cdn.test/a.jpg", title: "Spring" });
    expect(html).toContain('aria-checked="true"');
    const radios = [...html.matchAll(/<input type="radio"[^>]*name="popup-size"[^>]*>/g)].map((m) => [
      m[0].match(/value="(\w+)"/)?.[1],
      m[0].includes('checked=""'),
    ]);
    expect(radios).toEqual([
      ["SM", false],
      ["MD", false],
      ["LG", true],
    ]);
    expect(html).toContain("Export at 1080 × 1920 px");
    expect(html).toContain('src="https://cdn.test/a.jpg"');
    expect(html).toContain('aria-label="Preview: large popup, Spring"');
    expect(html).toContain("The X is always visible");
  });

  it("no image yet: asks for one, and the preview says where it goes", () => {
    const html = render({ popup: true });
    expect(html).toContain("Add an image. The popup is the image.");
    expect(html).toContain("Your image");
    expect(html).toContain("this update&#x27;s page when there is none");
  });

  it("shows the link a tap opens", () => {
    expect(render({ popup: true, ctaUrl: "/jobs" })).toContain(">/jobs</span>");
  });

  it("every control has its own name (law 12)", () => {
    const html = render({ popup: true });
    const n = names(html);
    expect(n).toContain("Show as a popup");
    expect(n).toContain("Upload popup image");
    expect(html).toContain('<label for="popup-image" class="text-[11px] text-slate-400">Popup image</label>');
    expect(new Set(n).size).toBe(n.length);
  });
});

/**
 * REGRESSION: the size cards and the Upload button hide their real input with
 * `sr-only` (position: absolute). Without `relative` on the wrapping label the
 * input sat elsewhere in the drawer, so a click there missed and keyboard
 * focus scrolled the drawer away from the card.
 */
describe("hidden inputs stay inside their control", () => {
  it("every label wrapping an sr-only input is positioned", () => {
    const html = render({ popup: true });
    const labels = [...html.matchAll(/<label class="([^"]*)"[^>]*>(?:(?!<\/label>).)*?class="sr-only"/gs)].map((m) => m[1]);
    expect(labels).toHaveLength(4); // three sizes + Upload
    for (const cls of labels) expect(cls.split(/\s+/)).toContain("relative");
  });
});
