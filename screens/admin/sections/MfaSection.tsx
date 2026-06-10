"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldOff,
  Copy,
  Download,
  Check,
  Loader2,
} from "lucide-react";
import {
  enrollMfa,
  confirmMfa,
  disableMfa,
  getMfaStatus,
  type MfaEnrollment,
  type MfaStatus,
} from "@/axios/auth";

type Phase =
  | "loading"
  | "idle-enrolled"
  | "idle-not-enrolled"
  | "enrolling"
  | "confirming"
  | "disabling";

/**
 * Embeddable MFA settings section. Used inside the admin Settings view.
 * For the standalone page version, see /admin/mfa/setup (currently deprecated).
 */
export function MfaSection() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [enrollment, setEnrollment] = useState<MfaEnrollment | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedRecoveryCodes, setSavedRecoveryCodes] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getMfaStatus();
        setStatus(s);
        setPhase(s.mfaEnabled ? "idle-enrolled" : "idle-not-enrolled");
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to load MFA status.");
        setPhase("idle-not-enrolled");
      }
    })();
  }, []);

  const startEnrollment = async () => {
    setError(null);
    setPhase("enrolling");
    try {
      const e = await enrollMfa();
      setEnrollment(e);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Could not start MFA enrollment.",
      );
      setPhase("idle-not-enrolled");
    }
  };

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!savedRecoveryCodes) {
      setError("Please confirm you saved your recovery codes first.");
      return;
    }
    setPhase("confirming");
    try {
      await confirmMfa(token);
      const s = await getMfaStatus();
      setStatus(s);
      setEnrollment(null);
      setToken("");
      setPhase("idle-enrolled");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "That code didn't work. Make sure your phone clock is accurate, then try the next code.",
      );
      setPhase("enrolling");
    }
  };

  const onDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhase("disabling");
    try {
      await disableMfa(token);
      const s = await getMfaStatus();
      setStatus(s);
      setToken("");
      setPhase("idle-not-enrolled");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Invalid code — MFA was not disabled.",
      );
      setPhase("idle-enrolled");
    }
  };

  const copySecret = async () => {
    if (!enrollment) return;
    try {
      await navigator.clipboard.writeText(enrollment.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const downloadRecoveryCodes = () => {
    if (!enrollment) return;
    const blob = new Blob(
      [
        `CompaniesCenter — MFA Recovery Codes\n` +
          `Generated: ${new Date().toISOString()}\n\n` +
          `Each code can be used ONCE in place of your 6-digit code.\n` +
          `Store them somewhere safe (password manager, paper in a drawer).\n\n` +
          enrollment.recoveryCodes.join("\n"),
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cpc-mfa-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {phase === "loading" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-500">
          <Loader2 size={20} className="animate-spin inline mr-2" />
          Loading MFA status…
        </div>
      )}

      {phase === "idle-not-enrolled" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex gap-3 items-start">
            <ShieldOff
              size={24}
              className="text-amber-500 dark:text-amber-300 mt-0.5 shrink-0"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                MFA is not enabled
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Once you enable it, every sign-in will require a 6-digit code
                from your authenticator app (Google Authenticator, Authy,
                1Password, etc.). You&apos;ll also get one-time recovery codes
                in case you lose your phone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={startEnrollment}
            className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            Enable MFA
          </button>
        </div>
      )}

      {(phase === "enrolling" || phase === "confirming") && enrollment && (
        <div className="space-y-5">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              1 · Scan with your authenticator app
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Open Google Authenticator / Authy / 1Password / Microsoft
              Authenticator and scan this QR code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <img
                src={enrollment.qrCodeDataUrl}
                alt="MFA QR code"
                width={192}
                height={192}
                className="rounded-lg border border-slate-100 dark:border-slate-800 bg-white"
              />
              <div className="text-xs text-slate-500 flex-1 space-y-2">
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  Can&apos;t scan?
                </p>
                <p>Enter this code into the app manually:</p>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 break-all">
                    {enrollment.secret}
                  </code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label="Copy secret"
                  >
                    {copiedSecret ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              2 · Save your recovery codes
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Each code can be used <strong>once</strong> if you lose access to
              your authenticator. We won&apos;t show them again.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {enrollment.recoveryCodes.map((c) => (
                <code
                  key={c}
                  className="font-mono text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md px-2.5 py-1.5 text-center"
                >
                  {c}
                </code>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={savedRecoveryCodes}
                  onChange={(e) => setSavedRecoveryCodes(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                I&apos;ve saved these somewhere safe
              </label>
              <button
                type="button"
                onClick={downloadRecoveryCodes}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-300 hover:underline"
              >
                <Download size={12} /> Download as .txt
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
              3 · Enter the current code
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Read the 6-digit code your authenticator app is showing right
              now.
            </p>

            <form onSubmit={onConfirm} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                aria-label="Authenticator code"
                value={token}
                onChange={(e) =>
                  setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-14 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-2xl outline-none focus:border-blue-400 tracking-[0.5em] font-mono text-center"
                placeholder="000000"
              />
              <button
                type="submit"
                disabled={
                  phase === "confirming" ||
                  token.length !== 6 ||
                  !savedRecoveryCodes
                }
                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {phase === "confirming" ? "Confirming…" : "Confirm and enable MFA"}
              </button>
            </form>
          </section>
        </div>
      )}

      {phase === "idle-enrolled" && (
        <div className="space-y-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 flex gap-3 items-start">
            <ShieldCheck
              size={24}
              className="text-emerald-600 dark:text-emerald-300 mt-0.5 shrink-0"
            />
            <div>
              <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
                MFA is enabled
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                Enrolled{" "}
                {status?.mfaEnrolledAt
                  ? new Date(status.mfaEnrolledAt).toLocaleString()
                  : "—"}
                . Every sign-in now requires your 6-digit code.
              </p>
            </div>
          </div>

          <form
            onSubmit={onDisable}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Disable MFA
            </h3>
            <p className="text-sm text-slate-500">
              Enter your current 6-digit code to prove possession of the second
              factor.
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              aria-label="Current MFA code"
              value={token}
              onChange={(e) =>
                setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full h-12 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-lg outline-none focus:border-blue-400 tracking-[0.4em] font-mono text-center"
              placeholder="000000"
            />
            <button
              type="submit"
              disabled={(phase as string) === "disabling" || token.length !== 6}
              className="w-full h-11 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(phase as string) === "disabling" ? "Disabling…" : "Disable MFA"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
