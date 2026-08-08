"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/axios/auth";
import { getProviderPlans, startCheckout, type BillingPlan } from "@/axios/billing";

const money = (cents: number, currency: string) => {
  const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : "";
  return `${symbol}${(cents / 100).toLocaleString()}`;
};

export default function UpgradePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/signin?next=/upgrade");
        return;
      }
      try {
        setPlans(await getProviderPlans());
      } catch {
        setError("Couldn't load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const subscribe = async (planId: string) => {
    setCheckingId(planId);
    setError(null);
    try {
      const { url } = await startCheckout(planId);
      window.location.href = url;
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          "Checkout isn't available yet. Please try again later.",
      );
      setCheckingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-3 py-1 text-xs font-semibold mb-4">
            <Sparkles size={13} /> CompaniesCenter Pro
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Grow your business faster
          </h1>
          <p className="text-slate-500 mt-2">
            Get seen first, win more work, and stand out to clients.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-slate-400">
            No plans are available right now. Please check back soon.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {plans.map((plan, i) => (
              <div
                key={plan._id}
                className={`rounded-2xl border p-6 bg-white dark:bg-slate-900 ${
                  i === 0
                    ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-800/50"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {money(plan.priceCents, plan.currency)}
                    </span>
                    <span className="text-xs text-slate-400"> / {plan.interval}</span>
                  </div>
                </div>
                {plan.description && (
                  <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                )}

                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => subscribe(plan._id)}
                  disabled={!!checkingId}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {checkingId === plan._id && (
                    <Loader2 size={15} className="animate-spin" />
                  )}
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center mt-6">{error}</p>}

        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-10">
          <ShieldCheck size={13} /> Secure checkout by Stripe / Paystack. You'll see the
          exact amount and currency before you pay.
        </p>
      </div>
    </div>
  );
}
