"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  ArrowLeftRight,
  CreditCard,
  FileText,
  Shield,
  Building2,
  ChevronRight,
} from "lucide-react";
import useGlobalStore from "@/stores";
import { MediaItem } from "@/types";

type AvatarVariant = "sm" | "md";

const AVATAR_CLASSES: Record<AvatarVariant, { wrap: string; text: string; img: string }> = {
  sm: { wrap: "w-[34px] h-[34px] text-[13px]", text: "", img: "w-[34px] h-[34px]" },
  md: { wrap: "w-11 h-11 text-[17px]", text: "", img: "w-11 h-11" },
};

function Avatar({ variant = "sm" }: { variant?: AvatarVariant }) {
  const { user, switchRole } = useGlobalStore();
  if (!user) return null;

  const cls = AVATAR_CLASSES[variant];
  const isProvider = switchRole === "Provider";
  const logoSrc = isProvider
    ? typeof (user.activeRoleId?.providerLogo as MediaItem)?.thumbnail === "string"
      ? (user.activeRoleId?.providerLogo as MediaItem).thumbnail
      : null
    : typeof user.profilePicture?.thumbnail === "string"
    ? user.profilePicture.thumbnail
    : null;

  const initials = isProvider
    ? (user.activeRoleId?.providerName ?? "P").charAt(0).toUpperCase()
    : `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U";

  return logoSrc ? (
    <Image
      src={logoSrc}
      alt="Profile"
      width={44}
      height={44}
      className={`rounded-full object-cover ${cls.img}`}
    />
  ) : (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-black ${cls.wrap}`}
    >
      {initials}
    </div>
  );
}

export default function ProfileMenu() {
  const router = useRouter();
  const { user, logout, switchRole, setSwitchRole } = useGlobalStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const isProvider = switchRole === "Provider";
  const hasProviderProfile = !!user.activeRoleId?._id;

  const displayName = isProvider
    ? user.activeRoleId?.providerName || "Your Business"
    : `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Account";

  const handleRoleSwitch = () => {
    if (!hasProviderProfile) {
      router.push("/onboarding");
      setOpen(false);
      return;
    }
    const next = isProvider ? "Client" : "Provider";
    setSwitchRole(next);
    router.replace(next === "Provider" ? "/" : "/providers");
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.replace("/");
  };

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger ── */}
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={open ? "true" : "false"}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 pr-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      >
        <div className="ring-2 ring-blue-200 dark:ring-blue-800 rounded-full group-hover:ring-blue-400 transition-all">
          <Avatar variant="sm" />
        </div>
        <ChevronDown
          size={13}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
          >
            {/* ── Header ── */}
            <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40">
              <div className="flex items-center gap-3">
                <div className="ring-2 ring-white dark:ring-gray-700 rounded-full shadow-md">
                  <Avatar variant="md" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isProvider
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    }`}
                  >
                    {isProvider ? (
                      <Building2 size={9} />
                    ) : (
                      <User size={9} />
                    )}
                    {isProvider ? "Provider" : "Client"}
                  </span>
                </div>
              </div>

              {/* Role switch */}
              <button
                type="button"
                onClick={handleRoleSwitch}
                className="mt-3 w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all group/sw"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight
                    size={13}
                    className="text-gray-400 group-hover/sw:text-blue-500 transition-colors"
                  />
                  <span>
                    Switch to{" "}
                    <span className="font-black">
                      {isProvider ? "Client" : "Provider"}
                    </span>
                  </span>
                </div>
                {!hasProviderProfile && (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                    Set up
                  </span>
                )}
                {hasProviderProfile && (
                  <ChevronRight
                    size={13}
                    className="text-gray-300 group-hover/sw:text-blue-400 transition-colors"
                  />
                )}
              </button>
            </div>

            {/* ── Menu items ── */}
            <div className="py-1.5">
              <MenuItem
                icon={User}
                label="My Profile"
                onClick={() => {
                  router.push("/profile");
                  setOpen(false);
                }}
              />
              <MenuItem
                icon={CreditCard}
                label="Membership & Billing"
                onClick={() => {
                  router.push("/profile?tab=billing");
                  setOpen(false);
                }}
              />
              <MenuItem
                icon={Settings}
                label="Settings"
                onClick={() => {
                  router.push("/settings");
                  setOpen(false);
                }}
              />
            </div>

            {/* ── Logout ── */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors group/lg"
              >
                <LogOut
                  size={15}
                  className="group-hover/lg:translate-x-0.5 transition-transform"
                />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    >
      <Icon
        size={15}
        className="text-gray-400 group-hover:text-blue-500 transition-colors"
      />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
