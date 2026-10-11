import type { Metadata } from "next";
import ContactMethods from "@/components/contact/ContactMethods";

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
        <ContactMethods />

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
