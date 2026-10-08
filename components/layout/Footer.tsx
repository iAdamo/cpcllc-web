"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { usePublicAppConfig } from "@/hooks/usePublicAppConfig";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_META, shownSocialLinks } from "@/lib/socialLinks";

const footerLinks = [
  {
    title: "For Clients",
    links: [
      { label: "Find Providers", href: "/providers" },
      { label: "Service Categories", href: "/companies/home-services" },
      { label: "Client Portal", href: "/clients" },
      { label: "My Requests", href: "/requests" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    title: "For Companies",
    links: [
      { label: "Join as a Provider", href: "/onboarding" },
      { label: "Company Profile", href: "/profile" },
      { label: "Find Jobs", href: "/providers" },
      { label: "Membership Plans", href: "/profile" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/contact" },
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Privacy Requests", href: "/privacy-request" },
      { label: "Copyright (DMCA)", href: "/dmca" },
      { label: "Legal Notices", href: "/legal-notice" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation();
  // Set in Admin > Settings > Social links; only the ones set are shown.
  const socials = shownSocialLinks(usePublicAppConfig().data?.socialLinks);

  return (
    <footer className="bg-[#050d2e] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10">
        {/* Top row — brand + contact */}
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-14 border-b border-white/10 mb-14">
          {/* Brand */}
          <div className="max-w-xs">
            <Image
              src="/assets/logo-white.png"
              alt="CompaniesCenterLLC"
              width={180}
              height={48}
              className="mb-5"
            />
            <p className="text-white/65 text-sm leading-relaxed mb-7">
              A marketplace for local service professionals in the US and
              Nigeria. Find a provider, compare reviews, and get the job done.
            </p>
            {/* Socials */}
            {socials.length ? (
              <ul className="flex flex-wrap gap-2.5" aria-label="Companies Center on social media">
                {socials.map(({ platform, url }) => (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Companies Center on ${SOCIAL_META[platform].label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/75 transition-colors hover:border-gold-400 hover:bg-white/10 hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                    >
                      <SocialIcon platform={platform} size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Contact info */}
          <div className="text-sm space-y-3">
            <p className="text-white font-bold text-base mb-4">Contact Us</p>
            <p className="flex items-center gap-2.5 text-white/60">
              <Phone size={15} aria-hidden className="shrink-0 text-gold-400" />
              <a href="tel:+18138971727" className="hover:text-white transition-colors">
                +1 (813) 897-1727
              </a>
            </p>
            <p className="flex items-start gap-2.5 text-white/60">
              <MapPin size={15} aria-hidden className="mt-0.5 shrink-0 text-gold-400" />
              <span>
                30190 US Highway 19N #1064
                <br />
                Clearwater, Florida 33761
              </span>
            </p>
            <p className="flex items-center gap-2.5 text-white/60">
              <Mail size={15} aria-hidden className="shrink-0 text-gold-400" />
              <a href="mailto:support@companiescenter.com" className="hover:text-white transition-colors">
                support@companiescenter.com
              </a>
            </p>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.12em] mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/65 hover:text-white text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/55 text-sm">
          <p>&copy; {new Date().getFullYear()} Companies Center LLC. {t("allRightsReserved")}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
