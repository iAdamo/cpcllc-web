import { NextRequest, NextResponse } from "next/server";

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const url = new URL(AUTOCOMPLETE_URL);
  url.searchParams.set("input", input);
  url.searchParams.set("key", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return NextResponse.json({ error: data.status }, { status: 502 });
  }

  return NextResponse.json(data.predictions ?? []);
}
