import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
  DETAILS_FIELDS,
  PlacesError,
  autocompletePlaces,
  newSessionToken,
  placeDetails,
} from "./googlePlaces";

/**
 * The website's address search on Places API (New) (2026-10-21). The
 * answers below are Google's, recorded with the production key (trimmed).
 * Before: the legacy Places API behind /api/places, a server route anyone
 * could call on our key; the 2026-10-20 pass deleted that route without
 * noticing stores/locationState.ts still called it.
 */
const AUTOCOMPLETE = {
  suggestions: [
    {
      placePrediction: {
        place: "places/ChIJV7tfNonEwogRCbHhOyaNrbo",
        placeId: "ChIJV7tfNonEwogRCbHhOyaNrbo",
        text: { text: "400 North Ashley Drive, Tampa, FL, USA" },
        structuredFormat: {
          mainText: { text: "400 North Ashley Drive" },
          secondaryText: { text: "Tampa, FL, USA" },
        },
        types: ["subpremise", "geocode"],
      },
    },
    { queryPrediction: { text: { text: "400 north ashley" } } },
  ],
};
const DETAILS = {
  id: "ChIJV7tfNonEwogRCbHhOyaNrbo",
  formattedAddress: "400 N Ashley Dr, Tampa, FL 33602, USA",
  addressComponents: [
    { longText: "400", shortText: "400", types: ["street_number"] },
    { longText: "North Ashley Drive", shortText: "N Ashley Dr", types: ["route"] },
    { longText: "Tampa", shortText: "Tampa", types: ["locality", "political"] },
    { longText: "Florida", shortText: "FL", types: ["administrative_area_level_1", "political"] },
    { longText: "United States", shortText: "US", types: ["country", "political"] },
    { longText: "33602", shortText: "33602", types: ["postal_code"] },
  ],
  location: { latitude: 27.947471, longitude: -82.460574 },
};

type Seen = { url: string; init: RequestInit };
const stub = (status: number, body: unknown, seen: Seen[] = []) =>
  (async (url: string, init: RequestInit) => {
    seen.push({ url, init });
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  }) as unknown as typeof fetch;

describe("address search on Places API (New)", () => {
  it("asks for US addresses with the key and the session, and lists predictions", async () => {
    const seen: Seen[] = [];
    const out = await autocompletePlaces("400 N Ashley", { key: "k", sessionToken: "s1", fetchImpl: stub(200, AUTOCOMPLETE, seen) });
    expect(seen[0].url).toBe("https://places.googleapis.com/v1/places:autocomplete");
    expect(seen[0].init.method).toBe("POST");
    expect((seen[0].init.headers as Record<string, string>)["X-Goog-Api-Key"]).toBe("k");
    expect(JSON.parse(String(seen[0].init.body))).toEqual({ input: "400 N Ashley", includedRegionCodes: ["us"], sessionToken: "s1" });
    // Only places (a bare query suggestion has no id to pick).
    expect(out).toEqual([
      {
        place_id: "ChIJV7tfNonEwogRCbHhOyaNrbo",
        description: "400 North Ashley Drive, Tampa, FL, USA",
        structured_formatting: { main_text: "400 North Ashley Drive", secondary_text: "Tampa, FL, USA" },
      },
    ]);
  });

  it("the picked place: only the fields onboarding stores, in the shape it reads", async () => {
    const seen: Seen[] = [];
    const d = await placeDetails("ChIJV7tfNonEwogRCbHhOyaNrbo", { key: "k", sessionToken: "s1", fetchImpl: stub(200, DETAILS, seen) });
    expect(seen[0].url).toBe("https://places.googleapis.com/v1/places/ChIJV7tfNonEwogRCbHhOyaNrbo?sessionToken=s1");
    expect((seen[0].init.headers as Record<string, string>)["X-Goog-FieldMask"]).toBe(DETAILS_FIELDS);
    expect(d.formatted_address).toBe("400 N Ashley Dr, Tampa, FL 33602, USA");
    expect(d.geometry.location).toEqual({ lat: 27.947471, lng: -82.460574 });
    expect(d.address_components).toContainEqual({ long_name: "Tampa", short_name: "Tampa", types: ["locality", "political"] });
  });

  it("a refused key is an error, not an empty list", async () => {
    const expired = { error: { code: 400, message: "API key expired. Please renew the API key.", status: "INVALID_ARGUMENT" } };
    await expect(autocompletePlaces("x", { key: "k", fetchImpl: stub(400, expired) })).rejects.toBeInstanceOf(PlacesError);
    await expect(autocompletePlaces("x", { key: undefined })).rejects.toThrow("Maps key is not set");
  });

  it("a place id that isn't one never reaches the URL", async () => {
    await expect(placeDetails("../../x?key=y", { key: "k", fetchImpl: stub(200, DETAILS) })).rejects.toThrow("Not a place id");
  });

  it("session tokens are v4 UUIDs, a new one each time", () => {
    const a = newSessionToken();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(newSessionToken()).not.toBe(a);
  });

  it("nothing on the site calls the removed /api/places route (gate)", () => {
    const base = join(__dirname, "..");
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((n) => {
        if (n === "node_modules" || n.startsWith(".")) return [];
        const p = join(dir, n);
        return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(n) && !n.endsWith(".test.ts") ? [p] : [];
      });
    const hits = ["app", "axios", "components", "context", "hooks", "lib", "screens", "stores", "utils"]
      .flatMap((r) => files(join(base, r)))
      .filter((f) => readFileSync(f, "utf8").includes("/api/places"))
      .map((f) => relative(base, f));
    expect(hits).toEqual([]);
  });
});
