"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight } from "lucide-react";
import { forgotPassword } from "@/axios/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      // Backend deliberately returns generic success even if email is unknown.
      // Only show errors for transport-level failures.
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Couldn't send the reset email. Try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center mb-3">
            <KeyRound size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Forgot password?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            We&apos;ll email you a 6-digit code and a reset link.
          </p>
        </div>

        {sent ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm text-center">
            <div className="text-sm text-slate-700 dark:text-slate-200">
              If an account exists for{" "}
              <strong className="text-slate-900 dark:text-white">{email}</strong>,
              we&apos;ve emailed it a reset code + link. Check your inbox.
            </div>
            <p className="text-xs text-slate-500">
              Didn&apos;t get it? Check your spam folder. The code expires in 60
              minutes.
            </p>
            <Link
              href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-300 hover:underline font-medium"
            >
              I have a code <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
          >
            {error && (
              <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>

            <p className="text-xs text-slate-500 text-center pt-2">
              Remembered it?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
