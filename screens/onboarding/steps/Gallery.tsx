"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Upload } from "lucide-react";
import Image from "next/image";
import useGlobalStore from "@/stores";
import StepShell from "./StepShell";

const MAX_FILES = 6;
const MAX_MB = 10;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Gallery({ onNext, onBack }: Props) {
  const { onboardingData, updateOnboardingData } = useGlobalStore();

  const [files, setFiles] = useState<File[]>(
    onboardingData.providerImageFiles ?? []
  );
  const [previews, setPreviews] = useState<string[]>(() =>
    (onboardingData.providerImageFiles ?? []).map((f) =>
      URL.createObjectURL(f)
    )
  );
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const valid = arr.filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_MB * 1024 * 1024
    );
    const combined = [...files, ...valid].slice(0, MAX_FILES);
    const newPreviews = combined.map((f) => URL.createObjectURL(f));
    setFiles(combined);
    setPreviews(newPreviews);
  };

  const removeFile = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleContinue = () => {
    updateOnboardingData({ providerImageFiles: files });
    onNext();
  };

  const atMax = files.length >= MAX_FILES;

  return (
    <StepShell
      step="4 of 4 · Gallery"
      title="Show clients your work"
      subtitle="Providers with 4+ photos get significantly more enquiries."
      onNext={handleContinue}
      onBack={onBack}
      nextLabel={files.length === 0 ? "Skip for now" : "Continue"}
    >
      <div className="space-y-4">
        {/* Counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">
            {files.length === 0
              ? "No photos added yet"
              : `${files.length} photo${files.length !== 1 ? "s" : ""} selected`}
          </p>
          <span
            className={`text-xs font-bold tabular-nums ${
              atMax ? "text-amber-500" : "text-gray-400"
            }`}
          >
            {files.length}/{MAX_FILES}
          </span>
        </div>

        {/* Drop zone */}
        {!atMax && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`w-full border-2 border-dashed rounded-2xl py-10 flex flex-col items-center gap-3 transition-all ${
              dragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                dragging ? "bg-blue-100" : "bg-white shadow-sm"
              }`}
            >
              {dragging ? (
                <Upload size={24} className="text-blue-500" />
              ) : (
                <ImagePlus size={24} className="text-blue-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700">
                {dragging ? "Drop your photos here" : "Upload photos"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Drag & drop or click · JPG, PNG · Max {MAX_MB}MB each
              </p>
            </div>
          </button>
        )}

        <input
          ref={fileRef}
          title=""
          placeholder="Showcase"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {/* Image grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
              >
                <Image
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  width={144}
                  height={144}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {/* Add more slot */}
            {!atMax && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 flex flex-col items-center justify-center gap-1 transition-all text-gray-400 hover:text-blue-500"
              >
                <ImagePlus size={18} />
                <span className="text-[10px] font-semibold">Add more</span>
              </button>
            )}
          </div>
        )}

        {files.length > 0 && files.length < 4 && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 font-medium">
            Tip: Add at least 4 photos to maximise client enquiries.
          </p>
        )}
      </div>
    </StepShell>
  );
}
