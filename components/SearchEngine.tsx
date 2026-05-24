"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPinIcon, SearchIcon } from "lucide-react";

export const SearchEngine = () => {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (service) params.set("q", service);
    if (location) params.set("location", location);
    router.push(`/providers?${params.toString()}`);
  };

  const popularSearches = ["Plumbing", "HVAC", "Electrical", "Cleaning", "Roofing"];

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Service input */}
        <div className="flex items-center flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
          <SearchIcon className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              What
            </span>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Plumbing, Electrical, HVAC..."
              className="text-gray-900 placeholder-gray-300 font-medium bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Location input */}
        <div className="flex items-center flex-1 px-5 py-4 border-b md:border-b-0 border-gray-100">
          <MapPinIcon className="text-blue-600 w-5 h-5 mr-3 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Where
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tampa, Florida"
              className="text-gray-900 placeholder-gray-300 font-medium bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Search button */}
        <div className="p-3 flex items-center">
          <button
            onClick={handleSearch}
            type="button"
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <SearchIcon className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Popular searches */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-white/60 text-sm font-medium">Popular:</span>
        {popularSearches.map((tag) => (
          <button
            key={tag}
            onClick={() => setService(tag)}
            type="button"
            className="text-white/90 text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors border border-white/20 backdrop-blur-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export const MSearchEngine = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="w-full flex bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center flex-1 px-4">
        <SearchIcon className="text-gray-400 w-4 h-4 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/providers?q=${encodeURIComponent(query)}`);
            }
          }}
          placeholder="Search services, companies..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-3"
        />
      </div>
      <button
        type="button"
        onClick={() => router.push(`/providers?q=${encodeURIComponent(query)}`)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-semibold transition-colors"
      >
        Go
      </button>
    </div>
  );
};
