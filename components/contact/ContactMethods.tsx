"use client";

import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { usePublicAppConfig } from "@/hooks/usePublicAppConfig";
import { mapsUrl, phoneHref, shownContact } from "@/lib/contact";

const CARD =
  "group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-800";
const ICON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-900/10 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300";

/**
 * The ways to reach the team on /contact: the email, phone and address staff
 * set in Admin > Settings > Contact details (today's details until the config
 * loads, lib/contact.ts). No phone saved: no phone card.
 */
export default function ContactMethods() {
  const config = usePublicAppConfig();
  const contact = shownContact(config.data?.contact);
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <a href={`mailto:${contact.email}`} className={CARD}>
        <span className={ICON}>
          <Mail size={20} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-900 dark:text-white">Email us</span>
          <span className="mt-0.5 block break-words text-sm text-brand-700 group-hover:underline dark:text-gold-400">
            {contact.email}
          </span>
          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
            Best for account help, disputes, and anything with details.
          </span>
        </span>
      </a>

      {contact.phone ? (
        <a href={phoneHref(contact.phone)} className={CARD}>
          <span className={ICON}>
            <Phone size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-gray-900 dark:text-white">Call us</span>
            <span className="mt-0.5 block text-sm text-brand-700 group-hover:underline dark:text-gold-400">
              {contact.phone}
            </span>
          </span>
        </a>
      ) : null}

      <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <span className={ICON}>
          <MessageCircle size={20} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-900 dark:text-white">In the app</span>
          <span className="mt-0.5 block text-sm text-gray-700 dark:text-gray-300">
            Open <span className="font-semibold">Profile → Customer Support</span> to chat with our team.
          </span>
          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
            Your account and recent activity come through with the message.
          </span>
        </span>
      </div>

      <a href={mapsUrl(contact.address)} target="_blank" rel="noopener noreferrer" className={CARD}>
        <span className={ICON}>
          <MapPin size={20} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-900 dark:text-white">Mailing address</span>
          <span className="mt-0.5 block text-sm text-gray-700 group-hover:underline dark:text-gray-300">
            {contact.address.map((line, i) => (
              <span key={`${i}-${line}`}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
        </span>
      </a>
    </div>
  );
}
