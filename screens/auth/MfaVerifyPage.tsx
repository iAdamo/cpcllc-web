"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import useGlobalStore from "@/stores";

interface PendingLogin {
  email: string;
  password: string;
  next?: string;
}

export default function MfaVerifyPage() {
  const router = useRouter();
  const { login, isAuthenticated, setError, error } = useGlobalStore();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Pull the credentials stashed by the sign-in page. If they're missing,
  // the user reached this URL directly — send them back to /signin.
  const pending = useMemo<PendingLogin | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem("mfa-pending");
      return raw ? (JSON.parse(raw) as PendingLogin) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!pending) {
      router.replace("/auth/signin");
    }
  }, [pending, router]);

  if (!pending) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({
        email: pending.email,
        password: pending.password,
        mfaToken: token,
      });
      if (isAuthenticated) {
        setError(null);
        window.sessionStorage.removeItem("mfa-pending");
        router.replace(pending.next ?? "/");
      } else {
        setError("That code didn't work. Try the current code from your app.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    window.sessionStorage.removeItem("mfa-pending");
    router.replace("/auth/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Enter your code
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Open your authenticator app and enter the current 6-digit code for{" "}
            <strong className="text-slate-900 dark:text-white">
              {pending.email}
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

          <div className="space-y-1.5">
            <label
              htmlFor="token"
              className="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              6-digit code (or one-time recovery code)
            </label>
            <input
              id="token"
              type="text"
              inputMode="text"
              autoComplete="one-time-code"
              maxLength={20}
              required
              autoFocus
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\s/g, ""))}
              className="w-full h-14 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-2xl outline-none focus:border-blue-400 tracking-[0.4em] font-mono text-center"
              placeholder="000000"
            />
            <p className="text-[11px] text-slate-400">
              Lost your phone? Enter one of your one-time recovery codes here.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || token.length < 6}
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Verify and sign in"}
          </button>

          <div className="text-xs text-slate-500 text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline"
            >
              Cancel and go back
            </button>
          </div>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Trouble?{" "}
          <Link href="/auth/signin" className="hover:underline">
            Start over
          </Link>
        </p>
      </div>
    </div>
  );
}
