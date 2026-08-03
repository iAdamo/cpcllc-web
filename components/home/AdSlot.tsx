"use client";

import { useEffect, useState } from "react";
import { getActiveAds, type Ad } from "@/axios/ads";

/**
 * Renders whatever ads the admin has set live for a placement (backend controls
 * off/demo/live). Renders nothing when there are none, so it's invisible until
 * the team turns ads on. Labeled "Sponsored" for transparency.
 */
export default function AdSlot({ placement = "home_banner" }: { placement?: string }) {
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    let cancelled = false;
    getActiveAds(placement)
      .then((a) => !cancelled && setAds(a))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (!ads.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-14 py-6">
      <div className={`grid gap-3 ${ads.length > 1 ? "md:grid-cols-2" : ""}`}>
        {ads.map((ad) => {
          const external = ad.ctaUrl?.startsWith("http");
          return (
            <a
              key={ad._id}
              href={ad.ctaUrl || "#"}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="relative block rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 min-h-[128px] group"
              style={{ backgroundColor: ad.backgroundColor || "#0f172a" }}
            >
              {ad.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <span className="absolute top-2 right-2 z-10 text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
                Sponsored
              </span>
              <div className="relative z-10 h-full flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-black text-lg">{ad.title}</p>
                {ad.description && (
                  <p className="text-white/85 text-sm mt-0.5 line-clamp-2">{ad.description}</p>
                )}
                {ad.ctaLabel && (
                  <span className="inline-block mt-3 self-start px-3.5 py-1.5 bg-white text-gray-900 rounded-full text-xs font-bold">
                    {ad.ctaLabel}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
