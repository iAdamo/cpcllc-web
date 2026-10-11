import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { CONTACT, CONTACT_MAPS_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Get help with Companies Center — reach our support team by email or phone, or open Support in the app.",
};


export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="bg-brand-900 dark:bg-brand-950 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-16">
          <p className="text-gold-400 text-xs font-black uppercase tracking-[0.15em] mb-3">
            Support
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            We&apos;re here to help
          </h1>
          <p className="text-white/60 mt-3 max-w-xl">
            Questions, feedback, or an issue with your account? Reach the
            Companies Center team any of these ways — we read every message and
            reply by email as soon as we can.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Email */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <Mail size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                Email us
              </span>
              <span className="mt-0.5 block break-words text-sm text-brand-700 group-hover:underline dark:text-gold-400">
                {CONTACT.email}
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                Best for account help, disputes, and anything with details.
              </span>
            </span>
          </a>

          {/* Phone */}
          <a
            href={CONTACT.phoneHref}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <Phone size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                Call us
              </span>
              <span className="mt-0.5 block text-sm text-brand-700 group-hover:underline dark:text-gold-400">
                {CONTACT.phone}
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                United States.
              </span>
            </span>
          </a>

          {/* In-app support */}
          <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <MessageCircle size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                In the app
              </span>
              <span className="mt-0.5 block text-sm text-gray-700 dark:text-gray-300">
                Open <span className="font-semibold">Profile → Support</span> to
                chat with our team.
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                Your account and recent activity come through with the message.
              </span>
            </span>
          </div>

          {/* Office */}
          <a
            href={CONTACT_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <MapPin size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                Mailing address
              </span>
              <span className="mt-0.5 block text-sm text-gray-700 group-hover:underline dark:text-gray-300">
                {CONTACT.address.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
            </span>
          </a>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          For how we handle your information, see our{" "}
          <a
            href="/privacy-policy"
            className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
          >
            Privacy Policy
          </a>
          . To ask for a copy, a correction or deletion of your information,
          or to appeal a decision, use{" "}
          <a
            href="/privacy-request"
            className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
          >
            Privacy requests
          </a>
          . To report a copyright infringement, see our{" "}
          <a
            href="/dmca"
            className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
          >
            Copyright and DMCA Policy
          </a>
          . For a Notice of Dispute, an arbitration opt-out or another legal
          notice, use{" "}
          <a
            href="/legal-notice"
            className="font-semibold text-brand-700 hover:underline dark:text-gold-400"
          >
            Legal notices
          </a>
          .
        </p>
      </div>
    </main>
  );
}
