"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";
import useGlobalStore from "@/stores";
import StepShell from "./StepShell";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileBasics({ onNext, onBack }: Props) {
  const { onboardingData, updateOnboardingData, user } = useGlobalStore();

  const [firstName, setFirstName] = useState(
    onboardingData.firstName ?? user?.firstName ?? ""
  );
  const [lastName, setLastName] = useState(
    onboardingData.lastName ?? user?.lastName ?? ""
  );
  const existingUrl = user?.profilePicture?.url ?? null;
  const [preview, setPreview] = useState<string | null>(
    onboardingData.profilePictureFile
      ? URL.createObjectURL(onboardingData.profilePictureFile)
      : existingUrl
  );
  const [hasNewFile, setHasNewFile] = useState(
    !!onboardingData.profilePictureFile
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateOnboardingData({ profilePictureFile: file });
    setPreview(URL.createObjectURL(file));
    setHasNewFile(true);
  };

  const handleContinue = () => {
    updateOnboardingData({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // Only carry the file if the user explicitly selected one
      ...(!hasNewFile && { profilePictureFile: null }),
    });
    onNext();
  };

  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <StepShell
      step="Step 2"
      title="Your personal profile"
      subtitle="This is how clients and providers will identify you."
      onNext={handleContinue}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      <div className="space-y-8">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 border-4 border-white shadow-xl ring-2 ring-blue-200 hover:ring-blue-400 transition-all group overflow-hidden"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
                width={96}
                height={96}
              />
            ) : (
              <User
                size={32}
                className="absolute inset-0 m-auto text-blue-400"
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera size={20} className="text-white" />
            </div>
          </button>
          <p className="text-xs text-gray-400 font-medium">
            {hasNewFile
              ? "Click to change photo"
              : existingUrl
              ? "Click to update photo"
              : "Upload a profile photo"}
          </p>
          <input
            ref={fileRef}
            title=""
            placeholder="Profile Picture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Name inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FloatInput
            label="First name"
            value={firstName}
            onChange={setFirstName}
            placeholder="John"
          />
          <FloatInput
            label="Last name"
            value={lastName}
            onChange={setLastName}
            placeholder="Smith"
          />
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const hasValue = value.length > 0;
  return (
    <div className="relative">
      <input
        type={type}
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
