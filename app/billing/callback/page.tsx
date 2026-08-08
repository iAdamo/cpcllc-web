"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * Return page after hosted checkout. The processor redirects here with
 * `?status=success|cancelled`. Payment truth comes from the webhook, so this
 * page only reflects the redirect outcome and points the provider back.
 */
export default function BillingCallbackPage() {
  return (
    <Suspense fallback={null}>
      <BillingCallbackInner />
    </Suspense>
  );
}

function BillingCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"success" | "cancelled" | "pending">(
    "pending",
  );

  useEffect(() => {
    const s = params.get("status");
    setStatus(s === "success" ? "success" : s === "cancelled" ? "cancelled" : "pending");
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        {status === "success" ? (
          <>
            <CheckCircle2 size={44} className="text-emerald-500 mx-auto" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              Payment received
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Your subscription activates as soon as we confirm the payment. This
              usually takes a few seconds.
            </p>
          </>
        ) : status === "cancelled" ? (
          <>
            <XCircle size={44} className="text-slate-400 mx-auto" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              Checkout cancelled
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              No charge was made. You can pick a plan again whenever you're ready.
            </p>
          </>
        ) : (
          <>
            <Loader2 size={40} className="text-slate-400 mx-auto animate-spin" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              Finishing up
            </h1>
          </>
        )}

        <button
          onClick={() => router.replace("/upgrade")}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-sm font-semibold"
        >
          Back to plans
        </button>
      </div>
    </div>
  );
}
