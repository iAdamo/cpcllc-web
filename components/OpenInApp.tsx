"use client";

import Image from "next/image";
import { APP_HOME, appLink } from "@/lib/sharePages";
import { AppStoreButtons, useStoreLinks } from "@/components/AppStoreButtons";

/**
 * "Continue in the app" (the Client Portal link in the footer, /clients).
 * Store buttons only for the stores the app is live in; before that, it says
 * the app is coming. Regression: the buttons pointed at placeholder ids
 * (com.your.app, id-your-app-id), the page was hidden at desktop width, and
 * "Open it now" did nothing.
 */
const OpenInApp = () => {
  const { appStore, googlePlay } = useStoreLinks();
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/assets/logo-color.svg" alt="Companies Center" width={96} height={96} className="rounded-lg" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">Continue in the app</h1>
        {appStore || googlePlay ? (
          <>
            <p className="text-gray-600 mb-6">
              Hiring, messages and your requests are in the Companies Center app. Download it to continue.
            </p>
            <AppStoreButtons className="mb-8" />
          </>
        ) : (
          <p className="text-gray-600 mb-8">
            Hiring, messages and your requests are in the Companies Center app, coming soon to the App Store and
            Google Play.
          </p>
        )}

        <p className="text-sm text-gray-500">
          Already have the app?{" "}
          <a href={appLink(APP_HOME)} className="text-brand-600 hover:text-brand-800 font-medium">
            Open it now
          </a>
        </p>
      </div>
    </div>
  );
};

export default OpenInApp;
