"use client";

import { useRef, useState } from "react";
import { Building2, Camera } from "lucide-react";
import useGlobalStore from "@/stores";
import Image from "next/image";
import StepShell from "./StepShell";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function CompanyIdentity({ onNext, onBack }: Props) {
  const { onboardingData, updateOnboardingData } = useGlobalStore();

  const [name, setName] = useState(onboardingData.providerName ?? "");
  const [tagline, setTagline] = useState(onboardingData.providerTagline ?? "");
  const [description, setDescription] = useState(
    onboardingData.providerDescription ?? ""
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateOnboardingData({ providerLogoFile: file });
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleContinue = () => {
    updateOnboardingData({
      providerName: name.trim(),
      providerTagline: tagline.trim(),
      providerDescription: description.trim(),
    });
    onNext();
  };

  const canContinue = name.trim().length > 0 && description.trim().length > 10;

  return (
    <StepShell
      step="1 of 4 · Identity"
      title="Your company profile"
      subtitle="Help clients understand who you are and what makes you great."
      onNext={handleContinue}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      <div className="space-y-7">
        {/* Logo upload */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 border-2 border-white shadow-lg ring-2 ring-blue-200 hover:ring-blue-400 transition-all group overflow-hidden shrink-0"
          >
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo"
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            ) : (
              <Building2
                size={28}
                className="absolute inset-0 m-auto text-blue-400"
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              <Camera size={18} className="text-white" />
            </div>
          </button>
          <div>
            <p className="font-bold text-gray-800 text-sm">Company logo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              PNG or JPG, at least 200x200px
            </p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              {logoPreview ? "Change logo" : "Upload logo"}
            </button>
          </div>
          <input
            ref={fileRef}
            title="Business Logo"
            type="file"
            placeholder=""
            accept="image/*"
            className="hidden"
            onChange={handleLogo}
          />
        </div>

        {/* Fields */}
        <FloatInput
          label="Company name *"
          value={name}
          onChange={setName}
          placeholder="Acme Services Inc."
        />
        <FloatInput
          label="Tagline"
          value={tagline}
          onChange={setTagline}
          placeholder="Fast, reliable, affordable"
        />

        {/* Description */}
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell clients what makes your business great, your experience, and what sets you apart…"
            rows={4}
            maxLength={500}
            className="w-full resize-none border-2 border-gray-200 rounded-xl bg-transparent px-4 pt-8 pb-3 text-gray-900 text-sm placeholder-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
          />
          <label className="absolute top-2.5 left-4 text-[10px] font-bold uppercase tracking-widest text-blue-600">
            Description *
          </label>
          <span className="absolute bottom-3 right-4 text-[10px] text-gray-300 tabular-nums">
            {description.length}/500
          </span>
        </div>
      </div>
    </StepShell>
  );
}

function FloatInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const hasValue = value.length > 0;
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="peer w-full border-b-2 border-gray-200 bg-transparent pt-5 pb-2 text-gray-900 font-semibold text-sm placeholder-gray-300 focus:border-blue-600 focus:outline-none transition-colors"
      />
      <label
        className={`absolute left-0 text-xs font-bold uppercase tracking-wider transition-all duration-200 pointer-events-none ${
          hasValue
            ? "top-0 text-blue-600"
            : "top-4 text-gray-400 text-sm normal-case tracking-normal font-normal"
        } peer-focus:top-0 peer-focus:text-blue-600 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider`}
      >
        {label}
      </label>
    </div>
  );
}
