"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 bg-gray-50">
      <p className="text-7xl font-black text-blue-600 mb-4">500</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500 text-center max-w-md mb-8">
        An unexpected error occurred on our side. Please try again — if it
        keeps happening, we&apos;re already looking into it.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-xl transition-colors text-center"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
