"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AppErrorService } from "@/lib/errorService";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    AppErrorService.log(error, {
      code: "UNEXPECTED_ERROR",
      category: "unexpected_system_error",
      severity: "critical",
      message: "The web app encountered an unexpected error.",
      technicalMessage: error.message,
      userMessage: "Something unexpected happened. We recorded the issue.",
      source: "web",
      module: "app-shell",
      service: "global-error",
      route: "/",
      feature: "global-error-boundary",
      context: { digest: error.digest },
    });
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 bg-gray-50">
      <p className="text-7xl font-black text-blue-600 mb-4">500</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Something went wrong
      </h1>
      <p className="text-sm text-gray-500 text-center max-w-md mb-8">
        We recorded the issue and can help if it continues. Please try again or
        return home.
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
