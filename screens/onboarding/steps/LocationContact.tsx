"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Check, Loader2 } from "lucide-react";
import useGlobalStore from "@/stores";
import StepShell from "./StepShell";
import { US_DIAL_CODE, formatUsDigits, usPhoneFromDigits } from "@/utils/phone";


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
    searchPlaces,
    getPlaceDetails,
    places,
    placesSearch,
  } = useGlobalStore();

  const [email, setEmail] = useState(onboardingData.providerEmail ?? "");
  const [localNumber, setLocalNumber] = useState("");
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
  const [loadingPlace, setLoadingPlace] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const existing = onboardingData.providerPhoneNumber;
    if (existing?.startsWith(US_DIAL_CODE)) {
      setLocalNumber(formatUsDigits(existing.slice(US_DIAL_CODE.length)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNumberChange = (text: string) => {
    setLocalNumber(formatUsDigits(text));
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
      void searchPlaces(""); // close the list
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

  const handleContinue = () => {
    const digits = localNumber.replace(/\D/g, "");
    updateOnboardingData({
      providerEmail: email.trim(),
      providerPhoneNumber: digits ? usPhoneFromDigits(digits) : undefined,
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
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-300 focus:border-brand-600 focus:outline-none transition-colors"
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
          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-brand-600 transition-colors">
            <span
              aria-hidden="true"
              className="flex items-center px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-700 shrink-0"
            >
              {US_DIAL_CODE}
            </span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              aria-label="Business phone"
              value={localNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="(201) 555-0123"
              className="flex-1 px-4 py-3 bg-transparent text-gray-900 text-sm placeholder-gray-300 focus:outline-none"
            />
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
                  className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 text-gray-900 text-sm placeholder-gray-300 focus:border-brand-600 focus:outline-none transition-colors"
                />
                {loadingPlace && (
                  <Loader2
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 animate-spin"
                  />
                )}
              </div>

              {addressQuery.trim().length > 2 && placesSearch === "failed" && (
                <p className="text-xs text-red-600 px-1" role="alert">
                  Address search isn&apos;t working right now. Please try again
                  in a moment.
                </p>
              )}
              {addressQuery.trim().length > 2 &&
                placesSearch === "done" &&
                places.length === 0 && (
                  <p className="text-xs text-gray-500 px-1" role="status">
                    No matching addresses. Check the spelling, or add the city.
                  </p>
                )}
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

              {/* Address is autocomplete-only. Device/browser geolocation is
                  deliberately not offered here: on mobile browsers without
                  GPS permission it falls back to coarse network-provider
                  coordinates, which put providers in the wrong place. */}
              <p className="text-xs text-gray-400 leading-snug px-1">
                Start typing to pick your exact business address from the
                suggestions.
              </p>
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
