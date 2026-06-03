"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface StepShellProps {
  step?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
  hidePrev?: boolean;
}

export default function StepShell({
  step,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextDisabled,
  nextLabel = "Continue",
  nextLoading,
  hidePrev,
}: StepShellProps) {
  return (
    <div className="flex flex-col min-h-full px-6 sm:px-10 py-8 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 space-y-1">
        {step && (
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            {step}
          </p>
        )}
        <h2 className="text-3xl font-black text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
        {!hidePrev && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || nextLoading}
          className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25"
        >
          {nextLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              {nextLabel}
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
