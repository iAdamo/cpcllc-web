import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SOCIAL_PLATFORMS, shownSocialLinks, socialLinkProblem } from "@/lib/socialLinks";
import SocialIcon from "@/components/SocialIcon";
import Footer from "@/components/layout/Footer";
import { TranslationProvider } from "@/context/TranslationContext";

/**
 * Social links: set in Admin > Settings, shown in the footer. Regressions:
 * every footer icon linked to "#", and the icons came from the React Native
 * set, which draws them dark on the web whatever the text colour, so they
 * vanished into the dark footer.
 */
const root = fileURLToPath(new URL("../", import.meta.url));

describe("social link rules (same as the API)", () => {
  it("platform pages on https only, no look-alike domains", () => {
    expect(socialLinkProblem("facebook", "https://www.facebook.com/cc")).toBeNull();
    expect(socialLinkProblem("x", "https://twitter.com/cc")).toBeNull();
    expect(socialLinkProblem("facebook", "https://facebook.com.evil.test/cc")).not.toBeNull();
    expect(socialLinkProblem("instagram", "http://instagram.com/cc")).not.toBeNull();
    expect(socialLinkProblem("tiktok", "")).toBeNull();
  });

  it("shows the set ones, in a fixed order", () => {
    expect(shownSocialLinks({ youtube: "https://youtube.com/@cc", facebook: " https://facebook.com/cc ", x: "" })).toEqual([
      { platform: "facebook", url: "https://facebook.com/cc" },
      { platform: "youtube", url: "https://youtube.com/@cc" },
    ]);
    expect(shownSocialLinks(undefined)).toEqual([]);
  });
});

describe("SocialIcon", () => {
  it.each(SOCIAL_PLATFORMS)("%s is drawn in the text colour and hidden from screen readers", (platform) => {
    const html = renderToStaticMarkup(<SocialIcon platform={platform} />);
    expect(html).toMatch(/^<svg/);
    expect(html).toMatch(/(stroke|fill)="currentColor"/);
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("footer", () => {
  const render = (socialLinks: object | undefined) => {
    const client = new QueryClient();
    if (socialLinks) client.setQueryData(["public-app-config"], { socialLinks });
    return renderToStaticMarkup(
      <QueryClientProvider client={client}>
        <TranslationProvider>
          <Footer />
        </TranslationProvider>
      </QueryClientProvider>,
    );
  };

  it("links each configured page, named for screen readers, in a new tab", () => {
    const html = render({ facebook: "https://www.facebook.com/cc", x: "https://x.com/cc" });
    expect(html).toContain('href="https://www.facebook.com/cc"');
    expect(html).toContain('aria-label="Companies Center on Facebook"');
    expect(html).toContain('aria-label="Companies Center on X"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('href="#"');
  });

  it("shows no social row when none are set", () => {
    expect(render({})).not.toContain("Companies Center on social media");
  });

  it("REGRESSION: uses web icons, never the React Native set", () => {
    for (const file of ["components/layout/Footer.tsx", "components/SocialIcon.tsx"]) {
      expect(readFileSync(`${root}${file}`, "utf8")).not.toMatch(/from ["']lucide-react-native["']/);
    }
  });
});
