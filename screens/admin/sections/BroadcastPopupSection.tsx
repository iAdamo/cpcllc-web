"use client";

import { X } from "lucide-react";
import type { Broadcast } from "@/axios/broadcast";
import { ImageField } from "@/components/admin/ImageField";
import {
  BANNER_CARD,
  POPUP_SIZES,
  POPUP_SIZE_KEYS,
  bannerFallbackImage,
  popupHint,
  popupImageOf,
  type PopupSize,
} from "@/lib/broadcastPopup";

/** An on/off switch with its own name. */
function Toggle({
  on,
  label,
  onChange,
}: {
  on: boolean;
  label: string;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative shrink-0 h-6 w-11 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 ${
        on ? "bg-fuchsia-600" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

/**
 * The composer's popup card: on/off, size, image and a phone preview. A popup
 * is a full image on top of any screen in the app, with an X to close it; a
 * tap opens the broadcast's CTA link. "Also show as a home banner" puts the
 * same picture on the home screen in one go.
 */
export function BroadcastPopupSection({
  form,
  onToggle,
  onChange,
  onUpload,
  onBannerToggle,
}: {
  form: Partial<Broadcast>;
  onToggle: (on: boolean) => void;
  onChange: (patch: Partial<Broadcast>) => void;
  onUpload: (file: File) => Promise<string>;
  onBannerToggle: (on: boolean) => void;
}) {
  const on = !!form.popup;
  const banner = form.placement === "HOME_BANNER";
  const ownSlides = (form.slides?.length ?? 0) > 0;
  const size: PopupSize = form.popupSize ?? "MD";
  const spec = POPUP_SIZES[size];
  const hint = popupHint(form);

  return (
    <section
      aria-labelledby="popup-heading"
      className={`rounded-xl border p-3 space-y-3 ${
        on
          ? "border-fuchsia-200 dark:border-fuchsia-900/60 bg-fuchsia-50/40 dark:bg-fuchsia-950/10"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            id="popup-heading"
            className="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Popup
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            A full image on top of any screen until the person closes it or
            taps it. Shown once per person.
          </p>
        </div>
        <Toggle on={on} label="Show as a popup" onChange={onToggle} />
      </div>

      {on && (
        <>
          <fieldset>
            <legend className="text-[11px] text-slate-400">Size</legend>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {POPUP_SIZE_KEYS.map((k) => {
                const s = POPUP_SIZES[k];
                const picked = k === size;
                return (
                  <label
                    key={k}
                    className={`relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 cursor-pointer text-center focus-within:ring-2 focus-within:ring-fuchsia-400 ${
                      picked
                        ? "border-fuchsia-500 bg-white dark:bg-slate-900 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="popup-size"
                      value={k}
                      checked={picked}
                      onChange={() => onChange({ popupSize: k })}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`block rounded-[3px] border-2 ${
                        picked ? "border-fuchsia-500" : "border-slate-300 dark:border-slate-600"
                      }`}
                      style={{ width: 22 * (s.width / s.height) ** 0.5, height: 22 / (s.width / s.height) ** 0.5 }}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {s.shape}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <ImageField
            id="popup-image"
            label="Popup image"
            value={form.popupImage ?? ""}
            onChange={(url) => onChange({ popupImage: url })}
            onUpload={onUpload}
            hint={`Export at ${spec.width} × ${spec.height} px. JPG, PNG, WebP or GIF, up to 5 MB.${
              !form.popupImage && form.coverImage ? " Empty uses the cover image." : ""
            }`}
          />
          {hint && (
            <p className="text-xs text-amber-700 dark:text-amber-400">{hint}</p>
          )}

          <div className="flex items-center gap-4">
            <PopupPreview image={popupImageOf(form)} size={size} title={form.title} />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tapping the image opens the CTA link below
              {form.ctaUrl ? (
                <>
                  {" "}
                  (<span className="font-mono text-slate-700 dark:text-slate-300 break-all">{form.ctaUrl}</span>)
                </>
              ) : (
                ", or this update's page when there is none"
              )}
              . The X is always visible.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Also show as a home banner
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The same picture on the home screen, until the person
                  dismisses it. Closing the popup leaves the banner.
                </p>
              </div>
              <Toggle
                on={banner}
                label="Also show as a home banner"
                onChange={onBannerToggle}
              />
            </div>
            {banner &&
              (ownSlides ? (
                <p className="text-[11px] text-slate-500">
                  The banner shows your slides (Home banner, below).
                </p>
              ) : (
                <>
                  <BannerPreview
                    image={bannerFallbackImage(form)}
                    size={form.bannerSize ?? "LG"}
                  />
                  <p className="text-[11px] text-slate-500">
                    Cropped to the banner&apos;s shape. For a wide picture
                    instead, add a slide under Home banner.
                  </p>
                </>
              ))}
          </div>
        </>
      )}
    </section>
  );
}

/** A phone with the popup over a dimmed screen, drawn at the app's sizes. */
export function PopupPreview({
  image,
  size,
  title,
}: {
  image: string;
  size: PopupSize;
  title?: string;
}) {
  const s = POPUP_SIZES[size];
  return (
    <div
      role="img"
      aria-label={`Preview: ${s.label.toLowerCase()} popup${title ? `, ${title}` : ""}`}
      className="relative shrink-0 w-[150px] aspect-[9/19.5] rounded-[22px] border-[5px] border-slate-800 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 overflow-hidden"
    >
      <div aria-hidden className="p-2 space-y-1.5">
        <div className="h-2 w-16 rounded bg-slate-300 dark:bg-slate-600" />
        <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-10 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-black/55 flex items-center justify-center">
        <div
          className="relative rounded-lg overflow-hidden bg-slate-300 dark:bg-slate-600 shadow-xl"
          style={{
            width: `${s.screenWidth * 100}%`,
            aspectRatio: `${s.width} / ${s.height}`,
            maxHeight: "86%",
          }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300">
              Your image
            </span>
          )}
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow">
            <X size={10} strokeWidth={3} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** The home-banner card as the app draws it: full width, the size's
 *  height, the picture cropped to fill. */
export function BannerPreview({
  image,
  size,
}: {
  image: string;
  size: "SM" | "MD" | "LG";
}) {
  const height = BANNER_CARD.height[size];
  return (
    <div
      role="img"
      aria-label={`Banner preview, ${size === "SM" ? "small" : size === "MD" ? "medium" : "large"}`}
      className="relative w-full max-w-[358px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700"
      style={{ aspectRatio: `${BANNER_CARD.width} / ${height}` }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-600 dark:text-slate-300">
          Your image
        </span>
      )}
    </div>
  );
}
