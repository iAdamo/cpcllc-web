import { NextRequest, NextResponse } from "next/server";

const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const FIELDS = "place_id,name,formatted_address,address_components,geometry";

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("place_id");
  if (!placeId) {
    return NextResponse.json({ error: "Missing place_id" }, { status: 400 });
  }

  const url = new URL(DETAILS_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("key", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ error: data.status }, { status: 502 });
  }

  return NextResponse.json(data.result);
}
