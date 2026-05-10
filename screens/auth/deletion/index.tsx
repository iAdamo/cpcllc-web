"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Archive,
  Trash2,
  Clock,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Key,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Check,
} from "lucide-react";

// ─── Validation ───────────────────────────────────────────────────────────────
const DeactivationSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    feedback: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type DeactivationFormType = z.infer<typeof DeactivationSchema>;

// ─── Data ─────────────────────────────────────────────────────────────────────
const REASONS = [
  {
    id: "temporary",
    label: "Taking a sabbatical",
    description: "Temporary pause — your data remains secure",
    Icon: Clock,
  },
  {
    id: "privacy",
    label: "Privacy optimisation",
    description: "Adjusting your digital footprint",
    Icon: Shield,
  },
  {
    id: "not_using",
    label: "Reduced engagement",
    description: "Currently less active on the platform",
    Icon: Eye,
  },
  {
    id: "found_alternative",
    label: "Exploring alternatives",
    description: "Found a better fit for your needs",
    Icon: ChevronRight,
  },
  {
    id: "too_many_notifications",
    label: "Communication preferences",
    description: "Adjusting notification settings",
    Icon: AlertCircle,
  },
  {
    id: "other",
    label: "Other considerations",
    description: "Please share your feedback below",
    Icon: HelpCircle,
  },
] as const;

type Step = "warning" | "form" | "confirm";
type Option = "deactivate" | "deletion" | "";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
      {children}
    </p>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

function PasswordInput({
  name,
  placeholder,
  control,
  error,
}: {
  name: "password" | "confirmPassword";
  placeholder: string;
  control: any;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div
            className={cn(
              "flex items-center h-12 rounded-xl border bg-white px-4 gap-3 transition-all",
              error
                ? "border-red-300 ring-1 ring-red-200"
                : "border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-200"
            )}
          >
            <Key size={15} className="text-slate-300 shrink-0" />
            <input
              {...field}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm placeholder:text-slate-300 outline-none"
            />
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        )}
      />
      <ErrorMsg msg={error} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface AccountDeactivationProps {
  isOpen: boolean;
  onClose: () => void;
  /** Replace with your real logout/deactivate action */
  onDeactivate?: (payload: {
    password: string;
    reason: string;
    shouldDeleteAfter30Days: boolean;
  }) => Promise<void>;
}

export default function AccountDeactivation({
  isOpen,
  onClose,
  onDeactivate,
}: AccountDeactivationProps) {
  const [option, setOption] = useState<Option>("");
  const [step, setStep] = useState<Step>("warning");
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<DeactivationFormType>({
    resolver: zodResolver(DeactivationSchema),
    mode: "onChange",
  });

  // Mount animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  const resetSheet = useCallback(() => {
    setOption("");
    setStep("warning");
    setSelectedReason("");
    reset();
    setMounted(false);
    setTimeout(onClose, 220);
  }, [onClose, reset]);

  // Keyboard dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) resetSheet();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, resetSheet]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDeactivation = async (data: DeactivationFormType) => {
    setIsLoading(true);
    try {
      await onDeactivate?.({
        password: data.password,
        reason: selectedReason || data.feedback || "No reason provided",
        shouldDeleteAfter30Days: option === "deletion",
      });
      resetSheet();
    } catch {
      alert("Unable to process. Please verify your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDeletion = option === "deletion";
  const accentBlue = "bg-blue-600 hover:bg-blue-700";
  const accentRed = "bg-red-600 hover:bg-red-700";
  const accent = isDeletion ? accentRed : accentBlue;
  const accentText = isDeletion ? "text-red-600" : "text-blue-600";
  const accentBg = isDeletion ? "bg-red-50" : "bg-blue-50";
  const accentBorder = isDeletion ? "border-red-200" : "border-blue-200";

  const selectedReasonObj = REASONS.find((r) => r.id === selectedReason);

  const STEP_LABELS: Record<Step, string> = {
    warning: "01 — Account Management",
    form: "02 — Identity Verification",
    confirm: "03 — Final Review",
  };
  const STEPS: Step[] = ["warning", "form", "confirm"];
  const stepIndex = STEPS.indexOf(step);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) resetSheet();
      }}
      className={cn(
        "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
        "bg-black/40 backdrop-blur-[2px] transition-opacity duration-200",
        mounted ? "opacity-100" : "opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Account deactivation"
    >
      <div
        className={cn(
          "relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl",
          "shadow-2xl flex flex-col max-h-[90dvh] transition-all duration-220",
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        {/* ── Drag handle (mobile) ─────────────────────────────────── */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          className={cn(
            "px-6 pt-5 pb-6 rounded-t-3xl sm:rounded-t-2xl shrink-0",
            isDeletion
              ? "bg-gradient-to-r from-slate-800 to-red-900"
              : "bg-gradient-to-r from-slate-800 to-blue-800"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
                {STEP_LABELS[step]}
              </p>
              <h2 className="text-white text-xl font-light tracking-tight leading-snug">
                {step === "warning" && "Account management"}
                {step === "form" && "Identity verification"}
                {step === "confirm" && "Final review"}
              </h2>
            </div>
            <button
              onClick={resetSheet}
              className="ml-4 shrink-0 w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5 mt-5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "flex-1 h-0.5 rounded-full transition-all duration-300",
                  i <= stepIndex ? "bg-white" : "bg-white/25"
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <div className="px-6 py-7 space-y-5">
            {/* ── STEP 1: Choose option ─────────────────────────────── */}
            {step === "warning" && (
              <>
                <p className="text-sm text-slate-500 leading-relaxed -mt-1">
                  If you need a break from Companies Center, you can temporarily
                  deactivate your account. To permanently erase all your data,
                  select permanent deletion.
                </p>

                {/* Deactivate card */}
                <button
                  type="button"
                  onClick={() => setOption("deactivate")}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 p-5 transition-all duration-150",
                    option === "deactivate"
                      ? "border-blue-500 bg-blue-50/60"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Archive size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800">
                          Temporary deactivation
                        </p>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all",
                            option === "deactivate"
                              ? "border-blue-500 bg-blue-500"
                              : "border-slate-300"
                          )}
                        >
                          {option === "deactivate" && (
                            <Check size={11} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Hide your profile and pause all activity. Your data
                        stays secure and you can return anytime.
                      </p>
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-blue-600">
                          <CheckCircle size={12} /> Data preserved
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-blue-600">
                          <CheckCircle size={12} /> Instant reactivation
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Deletion card */}
                <button
                  type="button"
                  onClick={() => setOption("deletion")}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 p-5 transition-all duration-150",
                    option === "deletion"
                      ? "border-red-400 bg-red-50/60"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Trash2 size={18} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800">
                          Permanent deletion
                        </p>
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all",
                            option === "deletion"
                              ? "border-red-500 bg-red-500"
                              : "border-slate-300"
                          )}
                        >
                          {option === "deletion" && (
                            <Check size={11} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Permanently erase your account and all associated data.
                        This action cannot be reversed.
                      </p>
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-red-500">
                          <AlertCircle size={12} /> All data erased
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-red-500">
                          <AlertCircle size={12} /> Irreversible action
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Warning for deletion */}
                {option === "deletion" && (
                  <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <AlertTriangle size={15} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Active engagements detected
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        Please fulfil any ongoing service commitments before
                        proceeding.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!option}
                  onClick={() => setStep("form")}
                  className={cn(
                    "w-full h-12 rounded-xl text-white text-sm font-semibold transition-all",
                    option
                      ? `${accent} active:scale-[0.98]`
                      : "bg-slate-200 cursor-not-allowed text-slate-400"
                  )}
                >
                  Continue
                </button>
              </>
            )}

            {/* ── STEP 2: Credentials ───────────────────────────────── */}
            {step === "form" && (
              <>
                {/* Reason selector */}
                <div>
                  <FieldLabel>Reason for leaving</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setReasonOpen(true)}
                    className={cn(
                      "w-full flex items-center gap-3 h-12 px-4 rounded-xl border bg-white text-left transition-all",
                      selectedReason
                        ? "border-slate-300"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {selectedReasonObj && (
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                        <selectedReasonObj.Icon
                          size={14}
                          className="text-slate-500"
                        />
                      </div>
                    )}
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        selectedReason
                          ? "text-slate-800 font-medium"
                          : "text-slate-400"
                      )}
                    >
                      {selectedReasonObj?.label || "Select a reason"}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-slate-400 shrink-0"
                    />
                  </button>
                </div>

                {/* Password */}
                <div>
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    name="password"
                    placeholder="Enter your password"
                    control={control}
                    error={errors.password?.message}
                  />
                </div>

                {/* Confirm password */}
                <div>
                  <FieldLabel>Confirm password</FieldLabel>
                  <PasswordInput
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    control={control}
                    error={errors.confirmPassword?.message}
                  />
                </div>

                {/* Feedback if "other" */}
                {selectedReason === "other" && (
                  <div>
                    <FieldLabel>Additional context</FieldLabel>
                    <Controller
                      name="feedback"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Share your thoughts (optional)"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-300 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 resize-none transition-all"
                        />
                      )}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    disabled={!isValid || isLoading || !selectedReason}
                    onClick={handleSubmit(() => setStep("confirm"))}
                    className={cn(
                      "w-full h-12 rounded-xl text-white text-sm font-semibold transition-all",
                      isValid && selectedReason
                        ? `${accent} active:scale-[0.98]`
                        : "bg-slate-200 cursor-not-allowed text-slate-400"
                    )}
                  >
                    Review decision
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("warning")}
                    className="w-full h-11 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: Confirm ───────────────────────────────────── */}
            {step === "confirm" && (
              <>
                {/* Summary card */}
                <div
                  className={cn(
                    "rounded-2xl border-2 p-6 flex flex-col items-center text-center",
                    accentBorder,
                    accentBg
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                      isDeletion ? "bg-red-100" : "bg-blue-100"
                    )}
                  >
                    {isDeletion ? (
                      <Trash2 size={28} className="text-red-600" />
                    ) : (
                      <Archive size={28} className="text-blue-600" />
                    )}
                  </div>
                  <h3 className={cn("text-lg font-semibold mb-1", accentText)}>
                    {isDeletion ? "Permanent deletion" : "Temporary pause"}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {isDeletion
                      ? "You are about to permanently delete your account. This action cannot be undone."
                      : "Your account will be temporarily deactivated. You can restore access at any time."}
                  </p>
                </div>

                {/* Implications */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    What happens next
                  </p>
                  <ul className="space-y-2.5">
                    {(isDeletion
                      ? [
                          "All personal data will be permanently erased",
                          "Active engagements will be terminated",
                          "Profile removed from all listings",
                          "Access credentials invalidated",
                        ]
                      : [
                          "Profile will be hidden from public view",
                          "Data remains encrypted and secure",
                          "All engagements will be paused",
                          "Access can be restored instantly",
                        ]
                    ).map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-2 shrink-0 w-1.5 h-1.5 rounded-full",
                            isDeletion ? "bg-red-400" : "bg-blue-400"
                          )}
                        />
                        <span className="text-sm text-slate-600 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSubmit(handleDeactivation)}
                    className={cn(
                      "w-full h-12 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98]",
                      accent,
                      isLoading && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : isDeletion ? (
                      "Confirm permanent deletion"
                    ) : (
                      "Confirm deactivation"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="w-full h-11 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    ← Review again
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full text-center text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors py-1"
                >
                  Need help? Contact support
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Reason picker modal ───────────────────────────────────────── */}
      {reasonOpen && (
        <div
          className="absolute inset-0 z-10 flex items-end sm:items-center justify-center bg-black/30"
          onClick={() => setReasonOpen(false)}
        >
          <div
            className={cn(
              "w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl transition-all duration-200",
              mounted ? "translate-y-0" : "translate-y-4"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
              <p className="font-semibold text-slate-800">Select reason</p>
              <button
                title="Reason"
                type="button"
                onClick={() => setReasonOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-72 px-3 py-2">
              {REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason.id);
                    setReasonOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-colors",
                    selectedReason === reason.id
                      ? "bg-slate-100"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    <reason.Icon size={15} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {reason.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {reason.description}
                    </p>
                  </div>
                  {selectedReason === reason.id && (
                    <Check size={15} className="text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="h-safe-area-bottom sm:h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
