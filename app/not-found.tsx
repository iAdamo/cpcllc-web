import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 bg-gray-50">
      <p className="text-7xl font-black text-blue-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        We couldn&apos;t find that page
      </h1>
      <p className="text-sm text-gray-500 text-center max-w-md mb-8">
        The page you&apos;re looking for may have been moved or no longer
        exists. Try searching for a service provider instead.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors text-center"
        >
          Back to home
        </Link>
        <Link
          href="/providers"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-bold rounded-xl transition-colors text-center"
        >
          Browse providers
        </Link>
      </div>
    </main>
  );
}
