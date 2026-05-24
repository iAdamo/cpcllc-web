"use client";

import Link from "next/link";
import Image from "next/image";
import {
  facebook,
  instagram,
  linkedin,
  tiktok,
  twitter,
  youtube,
} from "@/public/assets/icons";
import { useTranslation } from "@/context/TranslationContext";

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
      { label: "Help Center", href: "/help" },
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
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { icon: facebook, alt: "Facebook", href: "#" },
  { icon: instagram, alt: "Instagram", href: "#" },
  { icon: linkedin, alt: "LinkedIn", href: "#" },
  { icon: tiktok, alt: "TikTok", href: "#" },
  { icon: twitter, alt: "X / Twitter", href: "#" },
  { icon: youtube, alt: "YouTube", href: "#" },
];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#050d2e] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-14 pt-16 pb-10">
        {/* Top row — brand + contact */}
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-14 border-b border-white/10 mb-14">
          {/* Brand */}
          <div className="max-w-xs">
            <Image
              src="/assets/logo-white.svg"
              alt="CompaniesCenterLLC"
              width={180}
              height={48}
              className="mb-5"
            />
            <p className="text-white/45 text-sm leading-relaxed mb-7">
              Florida&apos;s trusted marketplace for home service professionals.
              Connecting homeowners with verified, background-checked providers
              since 2023.
            </p>
            {/* Socials */}
            <div className="flex gap-2.5">
              {socials.map(({ icon, alt, href }) => (
                <Link
                  key={alt}
                  href={href}
                  aria-label={alt}
                  className="w-9 h-9 bg-white/8 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors border border-white/10 hover:border-blue-600"
                >
                  <Image
                    src={icon}
                    alt={alt}
                    width={16}
                    height={16}
                    className="opacity-70"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="text-sm space-y-3">
            <p className="text-white font-bold text-base mb-4">Contact Us</p>
            <p className="flex items-center gap-2 text-white/50">
              <span>📞</span>
              <a
                href="tel:+18138971727"
                className="hover:text-white transition-colors"
              >
                +1 (813) 897-1727
              </a>
            </p>
            <p className="flex items-start gap-2 text-white/50">
              <span className="mt-0.5">📍</span>
              <span>
                30190 US Highway 19N #1064
                <br />
                Clearwater, Florida 33761
              </span>
            </p>
            <p className="flex items-center gap-2 text-white/50">
              <span>✉️</span>
              <a
                href="mailto:support@companiescenter.com"
                className="hover:text-white transition-colors"
              >
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
                      className="text-white/40 hover:text-white text-sm transition-colors"
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
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>
            &copy; 2025 CompaniesCenterLLC&trade;. {t("allRightsReserved")}
          </p>
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
