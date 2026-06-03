"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Navigation,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import useGlobalStore from "@/stores";
import StepShell from "./StepShell";

const COUNTRIES = [
  {
    code: "NG" as const,
    flag: "🇳🇬",
    dialCode: "+234",
    name: "Nigeria",
    placeholder: "801 234 5678",
    maxLen: 10,
  },
  {
    code: "US" as const,
    flag: "🇺🇸",
    dialCode: "+1",
    name: "United States",
    placeholder: "(201) 555-0123",
    maxLen: 10,
  },
];
type CountryCode = "NG" | "US";

function parseAddressComponents(
  components: { types?: string[]; long_name?: string }[]
) {
  const get = (type: string) =>
    components.find((c) => c.types?.includes(type))?.long_name ?? undefined;
  return {
    city: get("locality") ?? get("administrative_area_level_2"),
    state: get("administrative_area_level_1"),
    zip: get("postal_code"),
    country: get("country"),
  };
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function LocationContact({ onNext, onBack }: Props) {
  const {
    onboardingData,
    updateOnboardingData,
    getCurrentLocation,
    searchPlaces,
    getPlaceDetails,
    places,
    isLoading: storeLoading,
  } = useGlobalStore();

  const [email, setEmail] = useState(onboardingData.providerEmail ?? "");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    (onboardingData.phoneCountry as CountryCode) ?? "NG"
  );
  const [localNumber, setLocalNumber] = useState("");
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [confirmedAddress, setConfirmedAddress] = useState<
    | {
        address: string;
        city?: string;
        state?: string;
        country?: string;
        zip?: string;
        latitude?: number;
        longitude?: number;
      }
    | null
  >(
    onboardingData.location?.address
      ? (onboardingData.location as any)
      : null
  );
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingPlace, setLoadingPlace] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const country = COUNTRIES.find((c) => c.code === selectedCountry)!;

  useEffect(() => {
    const existing = onboardingData.providerPhoneNumber;
    if (existing) {
      const matched = COUNTRIES.find((c) => existing.startsWith(c.dialCode));
      if (matched) {
        setSelectedCountry(matched.code);
        setLocalNumber(existing.slice(matched.dialCode.length));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNumberChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, country.maxLen);
    let display = digits;
    if (country.code === "US" && digits.length >= 6) {
      display = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}${
        digits.length > 6 ? `-${digits.slice(6)}` : ""
      }`;
    } else if (country.code === "NG" && digits.length >= 4) {
      display = `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    setLocalNumber(display);
  };

  const handleAddressSearch = (q: string) => {
    setAddressQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (q.length > 2) {
      searchTimeout.current = setTimeout(() => searchPlaces(q), 300);
    }
  };

  const handleSelectPlace = async (place: {
    place_id: string;
    description: string;
  }) => {
    setLoadingPlace(true);
    const details = await getPlaceDetails(place.place_id);
    setLoadingPlace(false);
    if (details) {
      const parsed = parseAddressComponents(details.address_components ?? []);
      setConfirmedAddress({
        address: details.formatted_address || place.description,
        latitude: details.geometry?.location?.lat,
        longitude: details.geometry?.location?.lng,
        ...parsed,
      });
      setAddressQuery("");
    }
  };

  const handleDetectLocation = async () => {
    setLoadingLocation(true);
    const loc = await getCurrentLocation();
    setLoadingLocation(false);
    if (loc) {
      setConfirmedAddress({
        address: loc.formattedAddress ?? "",
        city: loc.city ?? undefined,
        state: loc.region ?? undefined,
        country: loc.country ?? undefined,
        zip: loc.postalCode ?? undefined,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    }
  };

  const handleContinue = () => {
    const digits = localNumber.replace(/\D/g, "");
    updateOnboardingData({
      providerEmail: email.trim(),
      providerPhoneNumber: digits ? `${country.dialCode}${digits}` : undefined,
      phoneCountry: selectedCountry,
      location: confirmedAddress ?? undefined,
    });
    onNext();
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneValid = localNumber.replace(/\D/g, "").length >= 7;
  const canContinue = emailValid && phoneValid && !!confirmedAddress;

  return (
    <StepShell
      step="3 of 4 · Contact"
      title="How can clients reach you?"
      subtitle="Accurate details help local clients connect with you instantly."
      onNext={handleContinue}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      <div className="space-y-6">
        {/* Email */}
        <div>
          <FieldLabel icon={<Mail size={12} />} label="Business Email" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@yourbusiness.com"
            autoComplete="email"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
          />
          {email.length > 0 && !emailValid && (
            <p className="text-xs text-red-500 mt-1">
              Enter a valid email address
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <FieldLabel icon={<Phone size={12} />} label="Business Phone" />
          <div className="relative">
            <div className="flex border-2 border-gray-200 rounded-xl overflow-visible focus-within:border-blue-600 transition-colors">
              <button
                type="button"
                onClick={() => setShowCountryDrop((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-200 transition-colors shrink-0"
              >
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {country.dialCode}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform duration-200 ${
                    showCountryDrop ? "rotate-180" : ""
                  }`}
                />
              </button>
              <input
                type="tel"
                value={localNumber}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder={country.placeholder}
                className="flex-1 px-4 py-3 bg-transparent text-gray-900 text-sm placeholder-gray-300 focus:outline-none"
              />
            </div>
            {showCountryDrop && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c.code);
                      setLocalNumber("");
                      setShowCountryDrop(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                      c.code === selectedCountry ? "bg-blue-50" : ""
                    }`}
                  >
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400">{c.dialCode}</p>
                    </div>
                    {c.code === selectedCountry && (
                      <Check size={14} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <FieldLabel icon={<MapPin size={12} />} label="Business Address" />
          {confirmedAddress ? (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <Check
                size={18}
                className="text-emerald-500 shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-700 mb-0.5">
                  Address confirmed
                </p>
                <p className="text-sm text-emerald-900 leading-snug">
                  {confirmedAddress.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedAddress(null)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 shrink-0 mt-0.5"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  type="text"
                  value={addressQuery}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  placeholder="Search your business address…"
                  className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 text-gray-900 text-sm placeholder-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
                />
                {loadingPlace && (
                  <Loader2
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
                  />
                )}
              </div>

              {places.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                  {places.map((p: any, i: number) => (
                    <button
                      key={p.place_id}
                      type="button"
                      onClick={() => handleSelectPlace(p)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        i < places.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1 leading-snug">
                        {p.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={loadingLocation || storeLoading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {loadingLocation ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Navigation size={15} />
                )}
                Use my current location
              </button>
            </div>
          )}
        </div>
      </div>
    </StepShell>
  );
}

function FieldLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
        {icon}
      </span>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
