"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import useGlobalStore from "@/stores";

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
  { id: "temporary", label: "Taking a sabbatical", description: "Temporary pause — your data remains secure", Icon: Clock },
  { id: "privacy", label: "Privacy optimisation", description: "Adjusting your digital footprint", Icon: Shield },
  { id: "not_using", label: "Reduced engagement", description: "Currently less active on the platform", Icon: Eye },
  { id: "found_alternative", label: "Exploring alternatives", description: "Found a better fit for your needs", Icon: ChevronRight },
  { id: "too_many_notifications", label: "Communication preferences", description: "Adjusting notification settings", Icon: AlertCircle },
  { id: "other", label: "Other considerations", description: "Please share your feedback below", Icon: HelpCircle },
] as const;

type Step = "warning" | "form" | "confirm";
type Option = "deactivate" | "deletion" | "";

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
            className={`flex items-center h-12 rounded-xl border bg-white dark:bg-gray-800 px-4 gap-3 transition-all ${
              error
                ? "border-red-300 ring-1 ring-red-200"
                : "border-slate-200 dark:border-gray-700 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-200"
            }`}
          >
            <Key size={15} className="text-slate-300 dark:text-gray-500 shrink-0" />
            <input
              {...field}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="text-slate-300 dark:text-gray-500 hover:text-slate-500 dark:hover:text-gray-300 transition-colors"
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccountDeletionPage() {
  const router = useRouter();
  const { logout } = useGlobalStore();

  const [option, setOption] = useState<Option>("");
  const [step, setStep] = useState<Step>("warning");
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<DeactivationFormType>({
    resolver: zodResolver(DeactivationSchema),
    mode: "onChange",
  });

  const handleDeactivation = useCallback(
    async (data: DeactivationFormType) => {
      setIsLoading(true);
      try {
        await logout({
          password: data.password,
          reason: selectedReason || data.feedback || "No reason provided",
          shouldDeleteAfter30Days: option === "deletion",
        });
        router.push("/");
      } catch {
        alert("Unable to process. Please verify your credentials and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [logout, option, selectedReason, router]
  );

  const isDeletion = option === "deletion";
  const accentBlue = "bg-blue-600 hover:bg-blue-700";
  const accentRed = "bg-red-600 hover:bg-red-700";
  const accent = isDeletion ? accentRed : accentBlue;
  const accentText = isDeletion ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400";
  const accentBg = isDeletion ? "bg-red-50 dark:bg-red-950/20" : "bg-blue-50 dark:bg-blue-950/20";
  const accentBorder = isDeletion ? "border-red-200 dark:border-red-800/50" : "border-blue-200 dark:border-blue-800/50";
  const selectedReasonObj = REASONS.find((r) => r.id === selectedReason);

  const STEPS: Step[] = ["warning", "form", "confirm"];
  const stepIndex = STEPS.indexOf(step);
  const STEP_LABELS: Record<Step, string> = {
    warning: "01 — Account Management",
    form: "02 — Identity Verification",
    confirm: "03 — Final Review",
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back */}
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Settings
        </Link>

        {/* Header */}
        <div
          className={`rounded-2xl mb-6 overflow-hidden bg-gradient-to-r ${
            isDeletion ? "from-slate-800 to-red-900" : "from-slate-800 to-blue-900"
          }`}
        >
          <div className="px-6 pt-6 pb-5">
            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
              {STEP_LABELS[step]}
            </p>
            <h2 className="text-white text-xl font-light tracking-tight leading-snug">
              {step === "warning" && "Account management"}
              {step === "form" && "Identity verification"}
              {step === "confirm" && "Final review"}
            </h2>
            {/* Progress bar */}
            <div className="flex gap-1.5 mt-5">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                    i <= stepIndex ? "bg-white" : "bg-white/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── STEP 1: Choose option ─────────────────────────────────── */}
        {step === "warning" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
              If you need a break from Companies Center, you can temporarily
              deactivate your account. To permanently erase all your data,
              select permanent deletion.
            </p>

            {/* Deactivate card */}
            <button
              type="button"
              onClick={() => setOption("deactivate")}
              className={`w-full text-left rounded-2xl border-2 p-5 transition-all bg-white dark:bg-gray-900 ${
                option === "deactivate"
                  ? "border-blue-500"
                  : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
                  <Archive size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      Temporary deactivation
                    </p>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all ${
                        option === "deactivate"
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300 dark:border-gray-600"
                      }`}
                    >
                      {option === "deactivate" && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Hide your profile and pause all activity. Your data stays
                    secure and you can return anytime.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                      <CheckCircle size={12} /> Data preserved
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
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
              className={`w-full text-left rounded-2xl border-2 p-5 transition-all bg-white dark:bg-gray-900 ${
                option === "deletion"
                  ? "border-red-400"
                  : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      Permanent deletion
                    </p>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-all ${
                        option === "deletion"
                          ? "border-red-500 bg-red-500"
                          : "border-slate-300 dark:border-gray-600"
                      }`}
                    >
                      {option === "deletion" && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Permanently erase your account and all associated data.
                    This action cannot be reversed.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle size={12} /> All data erased
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle size={12} /> Irreversible action
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {option === "deletion" && (
              <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Active engagements detected
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
                    Please fulfil any ongoing service commitments before proceeding.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!option}
              onClick={() => setStep("form")}
              className={`w-full h-12 rounded-xl text-white text-sm font-semibold transition-all ${
                option
                  ? `${accent} active:scale-[0.98]`
                  : "bg-slate-200 dark:bg-gray-700 cursor-not-allowed text-slate-400 dark:text-gray-500"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── STEP 2: Credentials ───────────────────────────────────── */}
        {step === "form" && (
          <div className="space-y-5">
            <div>
              <FieldLabel>Reason for leaving</FieldLabel>
              <button
                type="button"
                onClick={() => setReasonOpen(true)}
                className={`w-full flex items-center gap-3 h-12 px-4 rounded-xl border bg-white dark:bg-gray-800 text-left transition-all ${
                  selectedReason
                    ? "border-slate-300 dark:border-gray-600"
                    : "border-slate-200 dark:border-gray-700 hover:border-slate-300"
                }`}
              >
                {selectedReasonObj && (
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
                    <selectedReasonObj.Icon size={14} className="text-slate-500 dark:text-gray-400" />
                  </div>
                )}
                <span
                  className={`flex-1 text-sm ${
                    selectedReason
                      ? "text-slate-800 dark:text-white font-medium"
                      : "text-slate-400 dark:text-gray-500"
                  }`}
                >
                  {selectedReasonObj?.label || "Select a reason"}
                </span>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </button>
            </div>

            <div>
              <FieldLabel>Password</FieldLabel>
              <PasswordInput
                name="password"
                placeholder="Enter your password"
                control={control}
                error={errors.password?.message}
              />
            </div>

            <div>
              <FieldLabel>Confirm password</FieldLabel>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm your password"
                control={control}
                error={errors.confirmPassword?.message}
              />
            </div>

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
                      className="w-full rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-500 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 resize-none transition-all"
                    />
                  )}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={!isValid || !selectedReason}
                onClick={handleSubmit(() => setStep("confirm"))}
                className={`w-full h-12 rounded-xl text-white text-sm font-semibold transition-all ${
                  isValid && selectedReason
                    ? `${accent} active:scale-[0.98]`
                    : "bg-slate-200 dark:bg-gray-700 cursor-not-allowed text-slate-400 dark:text-gray-500"
                }`}
              >
                Review decision
              </button>
              <button
                type="button"
                onClick={() => setStep("warning")}
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-gray-700 text-sm text-slate-600 dark:text-gray-400 font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ───────────────────────────────────────── */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div
              className={`rounded-2xl border-2 p-6 flex flex-col items-center text-center ${accentBorder} ${accentBg}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  isDeletion ? "bg-red-100 dark:bg-red-950/40" : "bg-blue-100 dark:bg-blue-950/40"
                }`}
              >
                {isDeletion ? (
                  <Trash2 size={28} className="text-red-600 dark:text-red-400" />
                ) : (
                  <Archive size={28} className="text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${accentText}`}>
                {isDeletion ? "Permanent deletion" : "Temporary pause"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                {isDeletion
                  ? "You are about to permanently delete your account. This action cannot be undone."
                  : "Your account will be temporarily deactivated. You can restore access at any time."}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-3">
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
                      className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full ${
                        isDeletion ? "bg-red-400" : "bg-blue-400"
                      }`}
                    />
                    <span className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit(handleDeactivation)}
                className={`w-full h-12 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] ${accent} ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
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
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-gray-700 text-sm text-slate-600 dark:text-gray-400 font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
              >
                ← Review again
              </button>
            </div>

            <a
              href="mailto:support@companiescenterllc.com"
              className="block text-center text-xs text-slate-400 underline underline-offset-2 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
            >
              Need help? Contact support
            </a>
          </div>
        )}
      </div>

      {/* ── Reason picker overlay ─────────────────────────────────────── */}
      {reasonOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setReasonOpen(false)}
        >
          <div
            className="w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-gray-700" />
            </div>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-gray-800">
              <p className="font-semibold text-slate-800 dark:text-white">Select reason</p>
              <button
                type="button"
                title="Close"
                onClick={() => setReasonOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-72 px-3 py-2">
              {REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => { setSelectedReason(reason.id); setReasonOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left transition-colors ${
                    selectedReason === reason.id
                      ? "bg-slate-100 dark:bg-gray-800"
                      : "hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
                    <reason.Icon size={15} className="text-slate-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{reason.label}</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{reason.description}</p>
                  </div>
                  {selectedReason === reason.id && (
                    <Check size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
