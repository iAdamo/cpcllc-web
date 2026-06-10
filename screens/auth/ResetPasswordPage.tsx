"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/axios/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Both /reset-password?email=&code= (from the link) and manual entry work.
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If we landed via the link, scroll the password field into view.
  useEffect(() => {
    if (searchParams.get("code")) {
      document.getElementById("password")?.focus();
    }
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, password, code });
      setDone(true);
      setTimeout(() => router.replace("/auth/signin"), 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Couldn't reset your password. The code may be expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center mb-3">
            <KeyRound size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Reset your password
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the code from your email and pick a new password.
          </p>
        </div>

        {done ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 text-center space-y-2">
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
              Password reset
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Redirecting you to sign in…
            </p>
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
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="code"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Reset code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400 tracking-[0.4em] font-mono text-center"
                placeholder="000000"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Confirm new password
              </label>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting…" : "Reset password"}
            </button>

            <p className="text-xs text-slate-500 text-center pt-2">
              <Link
                href="/forgot-password"
                className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
              >
                Request a new code
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
