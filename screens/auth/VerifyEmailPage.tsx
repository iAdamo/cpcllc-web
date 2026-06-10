"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { verifyEmail, sendCode } from "@/axios/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentAt, setResentAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyEmail({ email, code });
      router.replace("/auth/signin");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "That code didn't work. It may be expired — try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) return;
    setError(null);
    setResending(true);
    try {
      await sendCode({ email });
      setResentAt(Date.now());
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Couldn't resend. Try again shortly.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center mb-3">
            <MailCheck size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Verify your email
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            We sent a 6-digit code to{" "}
            <strong className="text-slate-900 dark:text-white">
              {email || "your inbox"}
            </strong>
            .
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          {error && (
            <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {resentAt && !error && (
            <div className="text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-lg px-3 py-2">
              New code sent.
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="code"
              className="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full h-14 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-2xl outline-none focus:border-blue-400 tracking-[0.5em] font-mono text-center"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>

          <div className="text-xs text-slate-500 text-center pt-2 space-y-1">
            <p>
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={onResend}
                disabled={resending || !email}
                className="text-blue-600 dark:text-blue-300 hover:underline font-medium disabled:opacity-50"
              >
                {resending ? "Resending…" : "Resend code"}
              </button>
            </p>
            <p>
              Wrong email?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
              >
                Start over
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
