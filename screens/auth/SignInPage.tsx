"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import useGlobalStore from "@/stores";

export default function SignInPage() {
  const router = useRouter();
  const { login, error: mfaError } = useGlobalStore();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      console.log({ mfaError });
      if (mfaError && mfaError.includes("MFA")) {
        // Stash the credentials briefly in sessionStorage so the MFA page can
        // finish the login. Cleared as soon as the MFA page submits.
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            "mfa-pending",
            JSON.stringify({ email, password, next: nextPath })
          );
        }
        router.replace("/admin/mfa/verify");
        return;
      }

      // Successful login → navigate to next
      router.replace(nextPath);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Sign-in failed. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Sign in
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back. Enter your credentials to continue.
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
              htmlFor="email"
              className="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Email or phone number
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 dark:text-blue-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-xs text-slate-500 text-center pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          By signing in you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
