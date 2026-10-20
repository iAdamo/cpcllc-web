import type { Place, PlaceDetails } from "@/types";

/**
 * Address search on the website: Google Places API (New), called from the
 * browser with the public Maps key, as the app does (googlePlaceService.ts).
 * Replaced (2026-10-21) the legacy Places API, which a new key can't enable,
 * behind a server route that anyone could call on our key. Answers are
 * mapped to the legacy shapes the store and onboarding already read.
 *
 * The key must allow "Places API (New)" and be limited to the site's
 * addresses (HTTP referrers) in Google Cloud.
 */
const BASE = "https://places.googleapis.com/v1";
/** The marketplace is US only. */
export const PLACE_REGION_CODES = ["us"];
/** Only what onboarding stores; every field is billed. */
export const DETAILS_FIELDS = "id,formattedAddress,addressComponents,location";

/** A refused or failed request (an expired key answers 400/403). */
export class PlacesError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "PlacesError";
  }
}

/** One search, from first keystroke to the picked address, billed as one. */
export function newSessionToken(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

interface Opts {
  key: string | undefined;
  sessionToken?: string;
  fetchImpl?: typeof fetch;
}

async function failure(res: Response): Promise<PlacesError> {
  const body = await res.json().catch(() => null);
  return new PlacesError(res.status, body?.error?.message ?? `Places request failed (${res.status})`);
}

/** Suggestions for what someone typed, US addresses only. */
export async function autocompletePlaces(input: string, { key, sessionToken, fetchImpl = fetch }: Opts): Promise<Place[]> {
  if (!key) throw new PlacesError(0, "The Maps key is not set (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).");
  const res = await fetchImpl(`${BASE}/places:autocomplete`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
    body: JSON.stringify({
      input,
      includedRegionCodes: PLACE_REGION_CODES,
      ...(sessionToken ? { sessionToken } : {}),
    }),
  });
  if (!res.ok) throw await failure(res);
  const data = await res.json();
  return ((data?.suggestions ?? []) as any[])
    .filter((s) => s?.placePrediction?.placeId)
    .map((s) => {
      const p = s.placePrediction;
      return {
        place_id: p.placeId,
        description: p.text?.text ?? "",
        structured_formatting: {
          main_text: p.structuredFormat?.mainText?.text ?? "",
          secondary_text: p.structuredFormat?.secondaryText?.text ?? "",
        },
      };
    });
}

/** Google place ids are URL-safe; anything else never reaches the path. */
const PLACE_ID = /^[A-Za-z0-9_-]{1,512}$/;

/** The picked place: address, its parts and where it is. */
export async function placeDetails(placeId: string, { key, sessionToken, fetchImpl = fetch }: Opts): Promise<PlaceDetails> {
  if (!key) throw new PlacesError(0, "The Maps key is not set (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).");
  if (!PLACE_ID.test(placeId)) throw new PlacesError(0, "Not a place id.");
  const qs = sessionToken ? `?sessionToken=${encodeURIComponent(sessionToken)}` : "";
  const res = await fetchImpl(`${BASE}/places/${placeId}${qs}`, {
    headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": DETAILS_FIELDS },
  });
  if (!res.ok) throw await failure(res);
  const d = await res.json();
  return {
    place_id: d.id,
    name: d.formattedAddress ?? "",
    formatted_address: d.formattedAddress ?? "",
    address_components: ((d.addressComponents ?? []) as any[]).map((c) => ({
      long_name: c.longText ?? "",
      short_name: c.shortText ?? "",
      types: c.types ?? [],
    })),
    geometry: { location: { lat: d.location?.latitude, lng: d.location?.longitude } },
  } as PlaceDetails;
}
