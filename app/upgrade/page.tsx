"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Loader2,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import useGlobalStore from "@/stores";
import {
  getProviderPlans,
  getPaymentProviders,
  startCheckout,
  type BillingPlan,
  type PaymentProvider,
} from "@/axios/billing";
import { payWithPaystack } from "@/lib/paystack";

const NAVY = "#162660";
const GOLD = "#DEAE60";

const PROVIDER_LABEL: Record<PaymentProvider, string> = {
  stripe: "Card",
  paystack: "Paystack",
};

/** Cents → display string. Whole amounts drop the ".00". Always USD. */
const money = (cents: number) => {
  const whole = cents % 100 === 0;
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const intervalLabel = (interval: string) =>
  interval === "month"
    ? "per month"
    : interval === "quarter"
      ? "per quarter"
      : interval === "year"
        ? "per year"
        : `per ${interval}`;

const FAQ_ITEMS = [
  {
    q: "What happens right after I pay?",
    a: "Your plan activates instantly. The moment the payment clears, your account is upgraded — no waiting, no manual review.",
  },
  {
    q: "How do I pay?",
    a: "Pay by card, or with the options shown at checkout. You always see the exact amount before you confirm.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Pick a different plan any time — new paid time stacks on top of whatever period you have left, so you never lose days you already paid for.",
  },
  {
    q: "Is my payment information safe?",
    a: "Payments run on secure, PCI-compliant checkout. We never see or store your card details.",
  },
];

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UpgradePage() {
  const router = useRouter();
  const isAuthenticated = useGlobalStore((s) => s.isAuthenticated);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [method, setMethod] = useState<PaymentProvider | undefined>();
  const [loading, setLoading] = useState(true);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [list, provs] = await Promise.all([
        getProviderPlans().catch(() => {
          setError("Couldn't load plans. Please try again.");
          return [] as BillingPlan[];
        }),
        getPaymentProviders().catch(() => [] as PaymentProvider[]),
      ]);
      setPlans(list);
      setProviders(provs);
      setMethod(provs[0]);
      setLoading(false);
    })();
  }, []);

  const recommendedIndex = useMemo(
    () => (plans.length >= 3 ? 1 : plans.length - 1),
    [plans.length],
  );

  const subscribe = async (planId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/signin?next=/upgrade");
      return;
    }
    setCheckingId(planId);
    setError(null);
    try {
      const { accessCode, reference, url, provider } = await startCheckout(
        planId,
        method,
      );
      if (provider === "paystack" && accessCode) {
        // Complete payment in the in-page popup (no hosted redirect).
        const res = await payWithPaystack(accessCode);
        if (res.status === "success") {
          router.push(
            `/billing/callback?reference=${encodeURIComponent(
              res.reference ?? reference,
            )}`,
          );
        } else {
          setCheckingId(null);
        }
      } else if (url) {
        window.location.href = url; // hosted checkout (card)
      } else {
        throw new Error("no-checkout");
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          "Checkout isn't available yet. Please try again later.",
      );
      setCheckingId(null);
    }
  };

  const gridCols =
    plans.length >= 3
      ? "lg:grid-cols-3"
      : plans.length === 2
        ? "sm:grid-cols-2 max-w-3xl"
        : "max-w-md";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Hero: always solid navy so the headline reads in either theme ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: NAVY }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full blur-3xl opacity-40"
          style={{ background: GOLD }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white ring-1 ring-white/25"
              style={{ backgroundColor: "rgba(255,255,255,.1)" }}
            >
              <Sparkles size={13} style={{ color: GOLD }} /> CompaniesCenter Pro
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Win more work.
              <br className="hidden sm:block" /> Look the part.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-200/90">
              Get seen first, unlock the tools that close jobs, and stand out to
              every client browsing your area. Upgrade in under a minute.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-200/80">
              <span className="inline-flex items-center gap-1.5">
                <Zap size={13} style={{ color: GOLD }} /> Instant activation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} style={{ color: GOLD }} /> Secure checkout
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body: plans pulled up over the hero's bottom edge ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 -mt-14">
        {/* Payment method — only when there's a real choice */}
        {providers.length > 1 && method && (
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
              {providers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMethod(p)}
                  aria-pressed={method === p}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    method === p
                      ? "bg-brand-900 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {PROVIDER_LABEL[p]}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="max-w-md mx-auto text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-14">
            <Rocket className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Plans are on the way
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              No plans are available in your region just yet. Check back soon —
              we're rolling them out.
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 sm:gap-7 mx-auto items-stretch ${gridCols}`}>
            {plans.map((plan, i) => {
              const recommended = i === recommendedIndex;
              const busy = checkingId === plan._id;
              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 + i * 0.08 }}
                  className={`relative flex flex-col rounded-3xl p-7 transition-shadow ${
                    recommended
                      ? "text-white shadow-2xl lg:-mt-3 lg:mb-3 ring-1 ring-white/10"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl"
                  }`}
                  style={
                    recommended
                      ? {
                          background: `linear-gradient(165deg, ${NAVY} 0%, #0f1a45 100%)`,
                        }
                      : undefined
                  }
                >
                  {recommended && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 shadow-lg"
                      style={{ backgroundColor: GOLD }}
                    >
                      <Sparkles size={11} /> MOST POPULAR
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-lg font-bold ${
                        recommended ? "text-white" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {recommended && <BadgeCheck size={18} style={{ color: GOLD }} />}
                  </div>

                  {plan.description && (
                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        recommended ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-extrabold tracking-tight ${
                        recommended ? "text-white" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {money(plan.priceCents)}
                    </span>
                    <span className="text-sm text-slate-400">
                      {intervalLabel(plan.interval)}
                    </span>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: recommended
                                ? "rgba(222,174,96,.18)"
                                : "rgba(22,38,96,.08)",
                            }}
                          >
                            <Check
                              size={12}
                              strokeWidth={3}
                              style={{ color: recommended ? GOLD : NAVY }}
                            />
                          </span>
                          <span
                            className={`text-sm ${
                              recommended
                                ? "text-slate-200"
                                : "text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => subscribe(plan._id)}
                    disabled={!!checkingId}
                    aria-label={`Subscribe to ${plan.name}`}
                    className={`mt-7 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all active:scale-[.98] disabled:opacity-60 disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      recommended
                        ? "text-slate-900 hover:brightness-105 focus-visible:ring-offset-transparent"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 focus-visible:ring-slate-900 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
                    }`}
                    style={recommended ? { backgroundColor: GOLD } : undefined}
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {busy ? "Starting…" : `Get ${plan.name}`}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 text-sm text-red-500 dark:text-red-400 text-center"
          >
            {error}
          </p>
        )}

        {/* FAQ */}
        {!loading && (
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
              Questions, answered
            </h2>
            <div className="mt-6 space-y-3">
              {FAQ_ITEMS.map((item) => (
                <FaqRow key={item.q} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
