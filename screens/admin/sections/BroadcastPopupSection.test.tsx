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
      onBannerToggle={() => {}}
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
    const labels = [
      ...html.matchAll(/<label class="([^"]*)"[^>]*>(?:(?!<\/label>)[\s\S])*?class="sr-only"/g),
    ].map((m) => m[1]);
    expect(labels).toHaveLength(4); // three sizes + Upload
    for (const cls of labels) expect(cls.split(/\s+/)).toContain("relative");
  });
});

describe("popup and home banner in one go", () => {
  it("the switch is there once the popup is on, and says whether it is a banner too", () => {
    expect(render({ popup: false })).not.toContain("Also show as a home banner");
    const off = render({ popup: true, placement: "POPUP_ONLY" });
    expect(off).toContain('role="switch" aria-checked="false" aria-label="Also show as a home banner"');
    const on = render({ popup: true, placement: "HOME_BANNER", popupImage: "https://cdn.test/a.jpg", bannerSize: "LG" });
    expect(on).toContain('role="switch" aria-checked="true" aria-label="Also show as a home banner"');
  });

  it("with no slides, previews the popup image cropped to the banner's shape", () => {
    const html = render({ popup: true, placement: "HOME_BANNER", popupImage: "https://cdn.test/a.jpg", bannerSize: "MD" });
    expect(html).toContain('aria-label="Banner preview, medium"');
    expect(html).toContain("aspect-ratio:358 / 124");
    expect(html.match(/src="https:\/\/cdn.test\/a.jpg"/g)).toHaveLength(2); // popup and banner
    expect(html).toContain("Cropped to the banner");
  });

  it("with slides of its own, the banner shows those instead", () => {
    const html = render({
      popup: true,
      placement: "HOME_BANNER",
      popupImage: "https://cdn.test/a.jpg",
      slides: [{ image: "https://cdn.test/wide.jpg" }],
    });
    expect(html).not.toContain("Banner preview");
    expect(html).toContain("The banner shows your slides");
  });
});
