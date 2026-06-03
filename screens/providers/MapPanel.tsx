"use client";

import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import {
  Search,
  Navigation,
  Plus,
  Minus,
  CheckCircle,
  Star,
  List,
  Map,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProviderData, MediaItem } from "@/types";

const LIBRARIES: ("places" | "geometry")[] = ["places"];

const MAP_STYLES = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d5e8c4" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#aad3df" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#fefefe" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
];

const DEFAULT_CENTER = { lat: 27.9506, lng: -82.4572 };

function seedRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getProviderPosition(
  provider: ProviderData,
  index: number,
  center: { lat: number; lng: number }
) {
  // coordinates is typed ambiguously: { lat, long } object OR [number, number] tuple
  const raw = provider.location?.primary?.coordinates;
  if (raw) {
    if (Array.isArray(raw) && raw.length >= 2) {
      return { lat: raw[1] as number, lng: raw[0] as number };
    }
  }
  const seed1 = (provider._id?.charCodeAt(0) ?? index) * 13 + index * 7;
  const seed2 = (provider._id?.charCodeAt(1) ?? index) * 17 + index * 3;
  return {
    lat: center.lat + (seedRandom(seed1) - 0.5) * 0.1,
    lng: center.lng + (seedRandom(seed2) - 0.5) * 0.14,
  };
}

function makeMarkerSvg(label: string, active: boolean): string {
  const size = active ? 44 : 34;
  const r = active ? 18 : 14;
  const cx = size / 2;
  const fill = active ? "#1d4ed8" : "#2563eb";
  const sw = active ? 3 : 2;
  const fs = active ? 12 : 10;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cx}" r="${r}" fill="${fill}" stroke="white" stroke-width="${sw}"/><text x="${cx}" y="${
      cx + 4
    }" text-anchor="middle" fill="white" font-size="${fs}" font-weight="bold" font-family="Arial,sans-serif">${label}</text></svg>`
  )}`;
}

function getImageUrl(provider: ProviderData): string {
  const first = provider.providerImages?.[0];
  if (first && typeof first === "object" && "thumbnail" in first) {
    return (first as MediaItem).thumbnail || "/assets/men.jpg";
  }
  return "/assets/men.jpg";
}

const USER_PIN_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="10" fill="#2563eb" stroke="white" stroke-width="3"/>
    <circle cx="14" cy="14" r="5" fill="white"/>
  </svg>`
)}`;

interface MapPanelProps {
  providers: ProviderData[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  /** User's geolocation — map centres here and providers without coords scatter around it */
  center?: { lat: number; lng: number };
  className?: string;
}

export default function MapPanel({
  providers,
  hoveredId,
  onHover,
  viewMode,
  onViewModeChange,
  center,
  className = "",
}: MapPanelProps) {
  console.log("MapPanel render", { providers, hoveredId, viewMode, center });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(13);

  const resolvedCenter = center ?? DEFAULT_CENTER;

  // Pan to user's location when it arrives or changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  const selectedProvider = useMemo(
    () => providers.find((p) => p._id === selectedId),
    [providers, selectedId]
  );

  const pins = useMemo(
    () =>
      providers.slice(0, 40).map((p, i) => ({
        provider: p,
        pos: getProviderPosition(p, i, resolvedCenter),
        label: String(i + 1),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providers, resolvedCenter.lat, resolvedCenter.lng]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleZoom = (delta: number) => {
    if (!mapRef.current) return;
    const cur = mapRef.current.getZoom() ?? mapZoom;
    const next = cur + delta;
    mapRef.current.setZoom(next);
    setMapZoom(next);
  };

  const handleMyLocation = () => {
    if (!mapRef.current) return;
    if (center) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(14);
      return;
    }
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapRef.current?.panTo({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      mapRef.current?.setZoom(14);
    });
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* ── List / Map toggle ── */}
      <div className="absolute top-3 right-3 z-20">
        <div className="flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {(["list", "map"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold transition-all ${
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {mode === "list" ? <List size={12} /> : <Map size={12} />}
              <span className="capitalize">{mode} view</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Zoom & navigation controls ── */}
      <div className="absolute right-3 top-14 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => handleZoom(1)}
          aria-label="Zoom in"
          className="w-9 h-9 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-1)}
          aria-label="Zoom out"
          className="w-9 h-9 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          onClick={handleMyLocation}
          aria-label="My location"
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          <Navigation size={12} />
        </button>
      </div>

      {/* ── Provider count badge ── */}
      {providers.length > 0 && (
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-md border border-gray-100 text-xs font-bold text-gray-700">
            {providers.length} companies
          </div>
        </div>
      )}

      {/* ── Map ── */}
      {loadError ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-500 px-6 text-center">
            Map unavailable. Check your API key in <code>.env</code>.
          </p>
        </div>
      ) : !isLoaded ? (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={resolvedCenter}
          zoom={mapZoom}
          options={{
            disableDefaultUI: true,
            gestureHandling: "greedy",
            clickableIcons: false,
            styles: MAP_STYLES,
          }}
          onLoad={onMapLoad}
          onClick={() => setSelectedId(null)}
        >
          {pins.map(({ provider, pos, label }) => {
            const active =
              hoveredId === provider._id || selectedId === provider._id;
            return (
              <Marker
                key={provider._id}
                position={pos}
                icon={makeMarkerSvg(label, active)}
                zIndex={active ? 20 : 10}
                onMouseOver={() => onHover(provider._id)}
                onMouseOut={() => selectedId !== provider._id && onHover(null)}
                onClick={() =>
                  setSelectedId(
                    provider._id === selectedId ? null : provider._id
                  )
                }
                title={provider.providerName}
              />
            );
          })}

          {/* User location pin */}
          {center && (
            <Marker
              position={center}
              icon={USER_PIN_SVG}
              zIndex={30}
              title="Your location"
            />
          )}

          {selectedProvider && (
            <InfoWindow
              position={getProviderPosition(
                selectedProvider,
                providers.indexOf(selectedProvider),
                resolvedCenter
              )}
              onCloseClick={() => setSelectedId(null)}
              options={{ pixelOffset: { width: 0, height: -24 } as any }}
            >
              <div className="w-52 font-sans">
                <div className="flex gap-2.5">
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(selectedProvider)}
                      alt={selectedProvider.providerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm line-clamp-1">
                      {selectedProvider.providerName}
                    </p>
                    {selectedProvider.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-semibold">
                        <CheckCircle size={8} />
                        Verified
                      </span>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={9} fill="#f59e0b" color="#f59e0b" />
                      <span className="text-[11px] font-bold text-gray-800">
                        {selectedProvider.averageRating?.toFixed(1) ?? "New"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({selectedProvider.reviewCount ?? 0})
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/providers/${selectedProvider._id}`}
                  className="mt-2.5 block text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      {/* ── Search this area ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-blue-600 hover:text-white text-gray-800 text-xs font-bold rounded-full shadow-xl border border-gray-200 hover:border-blue-600 transition-all"
        >
          <Search size={12} />
          Search this area
        </motion.button>
      </div>
    </div>
  );
}
