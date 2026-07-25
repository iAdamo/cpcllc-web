"use client";

import Link from "next/link";

export function ErrorStateCard({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Recovery
        </p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Retry
            </button>
          ) : null}
          <Link
            href="/"
            className="rounded-xl border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
